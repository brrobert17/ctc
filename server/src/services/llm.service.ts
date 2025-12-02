import { Ollama } from 'ollama';
import { searchCars, getCarStats } from '../database/cars.db';
import { searchCarReviews, searchWeb } from './web-search.service';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Ollama client with optional API key for web search
const ollamaConfig: any = { 
  host: 'http://localhost:11434'
};

// Add API key if available for native web search
if (process.env.OLLAMA_API_KEY) {
  ollamaConfig.headers = {
    'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
  };
  console.log('[LLM] Ollama client initialized with API key for native web search');
} else {
  console.log('[LLM] Ollama client initialized without API key (fallback to DuckDuckGo)');
}

const ollama = new Ollama(ollamaConfig);

const SYSTEM_PROMPT = `You are an expert used car trading advisor with deep knowledge of the automotive market. Your role is to help users make informed decisions about buying and selling used vehicles.

Your expertise includes:
- Vehicle reliability, common issues, and maintenance costs
- Fair market pricing and valuation
- Identifying good deals and potential red flags
- Understanding vehicle history and condition indicators
- Fuel efficiency and total cost of ownership
- Market trends and depreciation patterns

Tone and Communication Style:
- Professional yet approachable and friendly
- Clear and concise explanations without overwhelming jargon
- Honest and transparent about potential issues
- Data-driven recommendations backed by market information
- Patient and thorough in answering questions

When providing advice:
1. Always consider the user's budget and needs
2. Highlight both pros and cons of any vehicle
3. Reference specific data from the database when available
4. Suggest alternatives or comparable options
5. Warn about common pitfalls in used car purchases

You have access to tools to:
- Search a database of current used car listings
- Research vehicle reviews and owner feedback online
- Get market statistics and pricing information

Always use these tools to provide accurate, data-backed advice.`;

interface Tool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: any;
  };
}

interface ToolCall {
  name: string;
  parameters: any;
}

const tools: Tool[] = [
  {
    type: 'function',
    function: {
      name: 'search_car_database',
      description:
        'Search the used car listings database. Use this to find specific vehicles, check pricing, or see what is available in the market.',
      parameters: {
        type: 'object',
        properties: {
          manufacturer: {
            type: 'string',
            description: 'Car manufacturer/brand (e.g., Toyota, Honda, Ford)',
          },
          model: {
            type: 'string',
            description: 'Car model name',
          },
          yearMin: {
            type: 'number',
            description: 'Minimum year',
          },
          yearMax: {
            type: 'number',
            description: 'Maximum year',
          },
          priceMin: {
            type: 'number',
            description: 'Minimum price in dollars',
          },
          priceMax: {
            type: 'number',
            description: 'Maximum price in dollars',
          },
          mileageMax: {
            type: 'number',
            description: 'Maximum mileage',
          },
          fuelType: {
            type: 'string',
            description: 'Fuel type (e.g., Gasoline, Hybrid, Electric, Diesel)',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results to return (default: 10)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_market_stats',
      description:
        'Get overall market statistics including total listings, available manufacturers, average prices, and price ranges.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'web_search',
      description:
        'Search the web for current information, reviews, market trends, or any other online data. Use this for general web queries and real-time information.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to look up on the web',
          },
          max_results: {
            type: 'number',
            description: 'Maximum number of results to return (default: 5, max: 10)',
          },
        },
        required: ['query'],
      },
    },
  },
];

async function executeTool(toolCall: ToolCall): Promise<string> {
  try {
    console.log('[LLM] executeTool called:', toolCall.name, toolCall.parameters);
    
    switch (toolCall.name) {
      case 'search_car_database':
        const cars = await searchCars(toolCall.parameters);
        if (cars.length === 0) {
          return 'No vehicles found matching those criteria.';
        }
        return JSON.stringify(
          cars.map((car) => ({
            manufacturer: car.manufacturer,
            model: car.model,
            year: car.year,
            price: car.price,
            mileage: car.mileage,
            fuel_type: car.fuel_type,
            transmission: car.transmission,
            accidents: car.accidents_or_damage,
            one_owner: car.one_owner,
            seller: car.seller_name,
            seller_rating: car.seller_rating,
          })),
          null,
          2
        );

      case 'get_market_stats':
        const stats = await getCarStats();
        return JSON.stringify(stats, null, 2);

      case 'web_search':
        console.log('[LLM] executing web_search tool');
        const query = toolCall.parameters.query || toolCall.parameters.q || '';
        const maxResults = toolCall.parameters.max_results || 5;
        
        if (!query) {
          return 'Error: No search query provided';
        }
        
        // Try native Ollama web search first if API key is available
        if (process.env.OLLAMA_API_KEY) {
          try {
            console.log('[LLM] using native Ollama web_search for:', query);
            // Check if webSearch method exists
            if (typeof (ollama as any).webSearch === 'function') {
              const nativeResults = await (ollama as any).webSearch({ 
                query, 
                max_results: Math.min(maxResults, 10) 
              });
              
              if (nativeResults && nativeResults.results && nativeResults.results.length > 0) {
                let summary = `Web search results for "${query}":\n\n`;
                nativeResults.results.forEach((result: any, index: number) => {
                  summary += `${index + 1}. ${result.title}\n`;
                  summary += `   ${result.content}\n`;
                  if (result.url) {
                    summary += `   Source: ${result.url}\n`;
                  }
                  summary += '\n';
                });
                console.log('[LLM] native web search returned', nativeResults.results.length, 'results');
                return summary;
              }
            } else {
              console.log('[LLM] webSearch method not available in this Ollama version, using fallback');
            }
          } catch (nativeError: any) {
            console.warn('[LLM] native web search failed, falling back to DuckDuckGo:', nativeError.message);
          }
        }
        
        // Fallback to DuckDuckGo
        console.log('[LLM] using DuckDuckGo fallback for:', query);
        const webResults = await searchWeb(query);
        let summary = `Web search results for "${query}":\n\n`;
        webResults.slice(0, maxResults).forEach((result, index) => {
          summary += `${index + 1}. ${result.title}\n`;
          summary += `   ${result.snippet}\n`;
          if (result.url) {
            summary += `   Source: ${result.url}\n`;
          }
          summary += '\n';
        });
        return summary;

      default:
        return `Unknown tool: ${toolCall.name}`;
    }
  } catch (error: any) {
    console.error('[LLM] tool execution error:', error);
    return `Error executing tool: ${error.message}`;
  }
}

export const testConnection = async (): Promise<{
  success: boolean;
  message: string;
  model?: string;
}> => {
  try {
    const response = await ollama.list();
    const models = response.models || [];
    const hasGptOss = models.some((m: any) => m.name.includes('gpt-oss'));

    if (!hasGptOss) {
      return {
        success: false,
        message:
          'Connected to Ollama, but gpt-oss model not found. Available models: ' +
          models.map((m: any) => m.name).join(', '),
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Ollama',
      model: 'gpt-oss',
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to connect to Ollama: ${error.message}. Make sure Ollama is running on localhost:11434`,
    };
  }
};

export const chat = async (
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> => {
  try {
    console.log('[LLM] chat called', {
      userMessage,
      historyLength: conversationHistory.length,
    });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    let response = await ollama.chat({
      model: 'gpt-oss',
      messages: messages,
      tools: tools,
      stream: false,
      options: {
        // GPU optimized - balanced for speed + quality + stability
        num_predict: 2048,        // Sweet spot for tool calling reliability
        num_ctx: 8192,            // Large context window for complex queries
        temperature: 0.7,         // Balanced creativity
        top_k: 40,                // Quality sampling
        top_p: 0.9,               // Nucleus sampling
        repeat_penalty: 1.1,      // Reduce repetition
      }
    });

    // Full raw response for debugging
    try {
      console.log('[LLM] full raw response from Ollama:',
        JSON.stringify(response, null, 2).slice(0, 2000)
      );
    } catch (e) {
      console.log('[LLM] full raw response from Ollama (non-JSON)', response);
    }

    console.log('[LLM] raw response from Ollama', {
      hasMessage: !!response?.message,
      role: response?.message?.role,
      contentPreview: response?.message?.content?.slice(0, 200),
    });

    let assistantMessage = response.message?.content || '';

    console.log('[LLM] initial assistant message', assistantMessage.slice(0, 200));

    // If the assistant message is empty, try to handle tool_calls from Ollama
    // With GPU: Allow 3 iterations for complex multi-tool queries
    let toolIterations = 0;
    const maxToolIterations = 3;

    if (!assistantMessage || !assistantMessage.trim()) {
      console.warn('[LLM] assistant message is empty; checking tool_calls');

      const toolCalls: any[] = (response as any).message?.tool_calls || [];

      if (Array.isArray(toolCalls) && toolCalls.length > 0) {
        console.log('[LLM] tool_calls from Ollama detected', toolCalls);

        const toolMessages: any[] = [];

        for (const call of toolCalls) {
          const fn: any = (call as any).function || {};
          const name: string = fn.name;
          let args: any = fn.arguments ?? {};

          if (typeof args === 'string') {
            try {
              args = JSON.parse(args);
            } catch {
              // keep as string
            }
          }

          // Execute the tool using our unified executeTool function
          console.log('[LLM] executing tool from tool_calls:', name, args);
          const toolResult = await executeTool({ name, parameters: args });
          
          toolMessages.push({
            role: 'tool',
            tool_name: name,
            content: toolResult,
          });
        }

        if (toolMessages.length > 0) {
          const messagesWithTools: any[] = [
            ...messages,
            { role: 'assistant', tool_calls: toolCalls },
            ...toolMessages,
          ];

          toolIterations++;
          console.log(`[LLM] calling Ollama chat with tool results (iteration ${toolIterations}/${maxToolIterations})`);
          
          // Allow up to 3 rounds of tool calls with GPU acceleration
          const toolResponse = await ollama.chat({
            model: 'gpt-oss',
            messages: messagesWithTools,
            tools: toolIterations < maxToolIterations ? tools : undefined, // Remove tools on last iteration
            stream: false,
            options: {
              num_predict: 2048,        // Stable for tool responses
              num_ctx: 8192,
              temperature: 0.7,
              top_k: 40,
              top_p: 0.9,
              repeat_penalty: 1.1,
            }
          });

          try {
            console.log(
              '[LLM] full response after tools:',
              JSON.stringify(toolResponse, null, 2).slice(0, 2000)
            );
          } catch {
            console.log('[LLM] response after tools (non-JSON)', toolResponse);
          }

          assistantMessage = toolResponse.message?.content || '';
          console.log('[LLM] assistant message after tools', assistantMessage.slice(0, 200));

          if (!assistantMessage || !assistantMessage.trim()) {
            console.warn(
              '[LLM] assistant message still empty after tools; forcing final response'
            );
            
            // Force model to provide a natural language answer
            // IMPORTANT: Remove tools to prevent infinite loop
            messagesWithTools.push({
              role: 'user',
              content: 'Based on the tool results above, please provide a clear, concise natural language answer to my original question. Do NOT call any more tools.'
            });
            
            const finalResponse = await ollama.chat({
              model: 'gpt-oss',
              messages: messagesWithTools,
              // NO TOOLS - force natural language only
              stream: false,
              options: {
                num_predict: 2048,        // Longer for comprehensive final answer
                num_ctx: 8192,
                temperature: 0.7,
                top_k: 40,
                top_p: 0.9,
              }
            });
            
            assistantMessage = finalResponse.message?.content || '';
            console.log('[LLM] final forced response', assistantMessage.slice(0, 200));
            
            if (!assistantMessage || !assistantMessage.trim()) {
              return 'I apologize, but I was unable to generate a response. Please try rephrasing your question.';
            }
          }

          // Update response for any further processing/logging
          response = toolResponse;
        } else {
          console.warn(
            '[LLM] tool_calls present but no executable tools'
          );
          return 'I apologize, but I encountered an issue executing the required tools. Please try again.';
        }
      } else {
        console.warn(
          '[LLM] assistant message is empty and no tool_calls provided'
        );
        return 'I apologize, but I was unable to generate a response. Please try again or rephrase your question.';
      }
    }
    let attempts = 0;
    const maxAttempts = 5;

    // Check if the model wants to use tools
    while (attempts < maxAttempts) {
      // Simple tool detection - look for function calls in the response
      const toolCallMatch = assistantMessage.match(
        /\[TOOL:(\w+)\]\s*(\{[^}]*\})?/
      );

      if (!toolCallMatch) {
        break;
      }

      const toolName = toolCallMatch[1];
      let toolParams = {};
      try {
        if (toolCallMatch[2]) {
          toolParams = JSON.parse(toolCallMatch[2]);
        }
      } catch (e) {
        // Invalid JSON, use empty params
      }

      console.log('[LLM] tool call detected', { toolName, toolParams });

      // Execute the tool
      const toolResult = await executeTool({ name: toolName, parameters: toolParams });

      console.log(
        '[LLM] tool result (truncated)',
        typeof toolResult === 'string' ? toolResult.slice(0, 200) : toolResult
      );

      // Add tool result to conversation
      messages.push({ role: 'assistant', content: assistantMessage });
      messages.push({
        role: 'user',
        content: `Tool "${toolName}" returned:\n${toolResult}\n\nPlease provide your response based on this information.`,
      });

      // Get new response
      console.log('[LLM] calling Ollama chat with updated messages:', messages);
      response = await ollama.chat({
        model: 'gpt-oss',
        messages: messages,
        tools: tools,
        stream: false,
        options: {
          num_predict: -1,
        }
      });

      console.log('[LLM] response after tool', {
        hasMessage: !!response?.message,
        role: response?.message?.role,
        contentPreview: response?.message?.content?.slice(0, 200),
      });

      assistantMessage = response.message?.content || '';

      console.log('[LLM] assistant message after tool', assistantMessage.slice(0, 200));
      attempts++;
    }

    console.log('[LLM] final assistant message', assistantMessage.slice(0, 200));

    return assistantMessage;
  } catch (error: any) {
    console.error('LLM Chat error:', error);
    throw new Error(`Failed to get response from LLM: ${error.message}`);
  }
};
