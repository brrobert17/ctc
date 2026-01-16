import { Router, Request, Response } from 'express';
import { testConnection, chatStream } from '../services/llm.service';
import { getCarCount } from '../database/cars.db';

const router = Router();

// Test endpoint to verify Ollama connection
router.get('/test', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await testConnection();
    res.status(result.success ? 200 : 503).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error testing connection',
      error: error.message,
    });
  }
});

// Health check for the LLM service
router.get('/health', async (req: Request, res: Response): Promise<void> => {
  try {
    const ollamaStatus = await testConnection();
    const totalCars = await getCarCount();

    res.status(200).json({
      success: true,
      services: {
        ollama: ollamaStatus,
        carsDatabase: {
          connected: true,
          totalListings: totalCars,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
    });
  }
});

// Streaming chat endpoint using Server-Sent Events (SSE)
router.post('/chat/stream', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Message is required and must be a string',
      });
      return;
    }

    const conversationHistory = Array.isArray(history) ? history : [];

    console.log('[LLM ROUTER] /chat/stream called', {
      message,
      historyLength: conversationHistory.length,
    });

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.flushHeaders();

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    // Stream the response
    for await (const chunk of chatStream(message, conversationHistory)) {
      if (chunk.type === 'error') {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        break;
      }
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    // Send done event
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Streaming chat endpoint error:', error);
    res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      message: 'Failed to process streaming chat request',
      error: error.message 
    })}\n\n`);
    res.end();
  }
});

export default router;
