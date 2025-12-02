import { Router, Request, Response } from 'express';
import { testConnection, chat } from '../services/llm.service';
import { loadCarsDatabase } from '../database/cars.db';

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
    const carsDb = await loadCarsDatabase();

    res.status(200).json({
      success: true,
      services: {
        ollama: ollamaStatus,
        carsDatabase: {
          loaded: carsDb.length > 0,
          totalListings: carsDb.length,
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

// Main chat endpoint - forward prompts to LLM with tools
router.post('/chat', async (req: Request, res: Response): Promise<void> => {
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

    console.log('[LLM ROUTER] /chat called', {
      message,
      historyLength: conversationHistory.length,
    });

    const response = await chat(message, conversationHistory);

    console.log('[LLM ROUTER] /chat response length', response?.length);

    res.status(200).json({
      success: true,
      response: response,
      message: response,
      timestamp: new Date().toISOString(),
      formatted: {
        text: response,
        wordCount: response.split(/\s+/).length,
        characterCount: response.length
      }
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat request',
      error: error.message,
    });
  }
});

// Simple prompt endpoint (no conversation history)
router.post('/prompt', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Prompt is required and must be a string',
      });
      return;
    }

    console.log('[LLM ROUTER] /prompt called', { prompt });

    const response = await chat(prompt);

    console.log('[LLM ROUTER] /prompt response length', response?.length);

    res.status(200).json({
      success: true,
      response: response,
      timestamp: new Date().toISOString(),
      formatted: {
        text: response,
        wordCount: response.split(/\s+/).length,
        characterCount: response.length
      }
    });
  } catch (error: any) {
    console.error('Prompt endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process prompt',
      error: error.message,
    });
  }
});

export default router;
