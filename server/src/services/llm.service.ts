import { Ollama } from 'ollama';
import { searchCars, getCarStats } from '../database/cars.db';
import { searchCarReviews, searchWeb } from './web-search.service';
import dotenv from 'dotenv';

dotenv.config();

// change localhost to ZeroTier IP for demo
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

// ==================== MODEL CONFIGURATION ====================
const MODEL_NAME = 'gpt-oss';
const USE_GPU = true;
const NUM_CTX = 16384;
const NUM_PREDICT = 2048;
const NUM_GPU_LAYERS = USE_GPU ? 999 : 0;

console.log(`[LLM] Using model: ${MODEL_NAME}, GPU: ${USE_GPU}, Context: ${NUM_CTX}`);
// ============================================================

const SYSTEM_PROMPT = `You are an expert used car trading advisor specializing in the Danish car market. Your role is to help users make informed decisions about buying and selling used vehicles in Denmark.

Your expertise includes:
- Vehicle reliability, common issues, and maintenance costs in Danish climate
- Fair market pricing and valuation in Danish Kroner (kr)
- Identifying good deals and potential red flags in the Danish market
- Understanding vehicle history and Danish registration requirements
- Fuel efficiency and total cost of ownership (including Danish taxes and fees)
- Danish market trends and depreciation patterns

Tone and Communication Style:
- Professional yet approachable and friendly
- Clear and concise explanations without overwhelming jargon
- Honest and transparent about potential issues
- Data-driven recommendations backed by Danish market data
- Patient and thorough in answering questions

When providing advice:
1. Consider the user's budget in Danish Kroner (kr)
2. Highlight both pros and cons of any vehicle
3. Reference specific data from the Danish database when available
4. Suggest alternatives or comparable options available in Denmark
5. Warn about common pitfalls in Danish used car purchases
6. Consider Danish regulations, taxes, and inspection requirements (syn)

You have access to a comprehensive PostgreSQL database with real Danish car listings including:
- Detailed specifications (make, model, year, mileage, engine, power)
- Pricing information in Danish Kroner across different segments
- Multiple fuel types (Benzin, Diesel, Hybrid, El/Electric, Plug-in Hybrid)
- Various body types (Sedan, SUV, Hatchback, Stationcar, etc.)
- Transmission types, drivetrains, colors

Available tools:
- search_car_database: Search the Danish database with multiple filters
- get_market_stats: Get comprehensive Danish market statistics and trends
- web_search: Research vehicle reviews and current information online

CRITICAL INSTRUCTIONS:
1. You MUST CALL these tools yourself - never explain to users how to call them
2. When a user asks about cars, IMMEDIATELY call search_car_database with appropriate parameters
3. NEVER show tool syntax or code examples to users - that's your internal API
4. After calling tools and getting results, present the information naturally in your response
5. Users cannot see or call these tools - only you can

Example: If user asks "Show me BMWs", you call search_car_database({manufacturer: "BMW"}) and then present the results.

Always use these tools to provide accurate, data-backed advice based on real Danish market data. Prices should always be referenced in Danish Kroner (kr).`;

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

interface ContextData {
  webContext?: string;
  databaseContext?: string;
  marketContext?: string;
}

const tools: Tool[] = [
  {
    type: 'function',
    function: {
      name: 'search_car_database',
      description:
        'Search the used car listings database. Use this to find specific vehicles, check pricing, or see what is available in the market. Returns detailed information including make, model, year, price, mileage, fuel type, transmission, body type, and more.',
      parameters: {
        type: 'object',
        properties: {
          manufacturer: {
            type: 'string',
            description: 'Car manufacturer/brand (e.g., Toyota, Honda, Ford, BMW)',
          },
          model: {
            type: 'string',
            description: 'Car model name (e.g., Corolla, Civic, F-150)',
          },
          yearMin: {
            type: 'number',
            description: 'Minimum model year (e.g., 2015)',
          },
          yearMax: {
            type: 'number',
            description: 'Maximum model year (e.g., 2023)',
          },
          priceMin: {
            type: 'number',
            description: 'Minimum price',
          },
          priceMax: {
            type: 'number',
            description: 'Maximum price',
          },
          mileageMax: {
            type: 'number',
            description: 'Maximum mileage in kilometers',
          },
          fuelType: {
            type: 'string',
            description: 'Fuel type (e.g., Gasoline, Diesel, Hybrid, Electric, Plug-in Hybrid)',
          },
          bodyType: {
            type: 'string',
            description: 'Body type (e.g., Sedan, SUV, Hatchback, Coupe, Wagon, Van)',
          },
          transmission: {
            type: 'string',
            description: 'Transmission type (e.g., Automatic, Manual)',
          },
          drivetrain: {
            type: 'string',
            description: 'Drivetrain type (e.g., FWD, RWD, AWD, 4WD)',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results to return (default: 10, max: 50)',
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
        'Get comprehensive market statistics including total listings, available manufacturers, average prices, price ranges, average mileage, and distribution by fuel type and body type. Use this to provide market overview and trends.',
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
        'Search the web for current information, reviews, or general data about cars. Use this when you need information not available in the database.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query',
          },
        },
        required: ['query'],
      },
    },
  },
];

//Gather context for the user's query by analyzing intent and pre-fetching relevant data
async function gatherContext(userMessage: string): Promise<ContextData> {
  console.log('[LLM CONTEXT] ===== ANALYZING USER INTENT =====');
  console.log('[LLM CONTEXT] User message:', userMessage);
  
  const context: ContextData = {};
  
  try {
    // Use a lightweight LLM call to extract car-related entities and intent
    const analysisPrompt = `Analyze this user query and extract information. Return ONLY a JSON object with these fields:
- "carMake": the car manufacturer mentioned (e.g., "Volkswagen", "BMW", "Toyota") or null
- "carModel": the specific model mentioned (e.g., "Golf GTI", "3 Series", "Corolla") or null
- "queryType": one of "search_listings", "get_info", "general_advice", or "other"
- "priceRange": any budget/price mentioned (e.g., "under 100000", "affordable") or null

User query: "${userMessage}"

Return ONLY valid JSON, no other text.`;

    const analysis = await ollama.chat({
      model: MODEL_NAME,
      messages: [{ role: 'user', content: analysisPrompt }],
      stream: false,
      options: {
        temperature: 0, // Zero temperature for deterministic JSON extraction
        num_predict: 200, // Minimal - we only need ~100 chars of JSON
        num_ctx: 1024, // Reduced context window for faster processing
        num_gpu: NUM_GPU_LAYERS,
      }
    });

    const fullContent = analysis.message.content.trim();
    console.log('[LLM CONTEXT] Analysis response:', fullContent.slice(0, 200));

    let extracted: any = {};
    try {
      // Try to extract JSON from the response
      const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extracted = JSON.parse(jsonMatch[0]);
        console.log('[LLM CONTEXT] Extracted intent:', JSON.stringify(extracted));
      } else {
        // Fallback: try parsing the entire content
        extracted = JSON.parse(fullContent);
      }
    } catch (e: any) {
      console.log('[LLM CONTEXT] JSON parse failed, proceeding without context:', e.message);
      return context; // Return empty context
    }

    // Build a context message that guides the model on what to do
    let guidance = '';
    
    if (extracted.carMake) {
      guidance += `User is interested in: ${extracted.carMake}`;
      if (extracted.carModel) {
        guidance += ` ${extracted.carModel}`;
      }
      guidance += '\n';
    }
    
    if (extracted.priceRange) {
      guidance += `Budget/Price constraint: ${extracted.priceRange}\n`;
    }
    
    if (extracted.queryType === 'search_listings') {
      guidance += 'User wants to see available car listings. Use search_car_database tool.\n';
    } else if (extracted.queryType === 'get_info') {
      guidance += 'User wants general information about a car model. Use web_search tool if needed.\n';
    }
    
    if (guidance) {
      context.marketContext = guidance.trim();
      console.log('[LLM CONTEXT] Guidance:', guidance);
    }

  } catch (error: any) {
    console.error('[LLM CONTEXT] ERROR analyzing intent:', error.message);
  }

  console.log('[LLM CONTEXT] ===== INTENT ANALYSIS COMPLETE =====');
  return context;
}

async function executeTool(toolCall: ToolCall): Promise<string> {
  try {
    console.log('[LLM] executeTool called:', toolCall.name, toolCall.parameters);
    
    switch (toolCall.name) {
      case 'search_car_database':
        const cars = await searchCars(toolCall.parameters);
        if (cars.length === 0) {
          return 'No vehicles found matching those criteria. Try broadening the search parameters.';
        }
        return JSON.stringify(
          cars.map((car) => ({
            id: car.id,
            make: car.make,
            model: car.model,
            year: car.model_year,
            price: car.price,
            mileage: car.mileage,
            fuel_type: car.fuel_type,
            transmission: car.transmission_type,
            drivetrain: car.drivetrain,
            body_type: car.body_type,
            color: car.color,
            interior_color: car.interior_color,
            engine: car.engine_displacement,
            power: car.power,
            doors: car.doors,
            seats: car.seats,
            owners: car.number_of_owners,
            location: car.car_location,
            url: car.url,
            description: car.description ? car.description.substring(0, 200) : null,
          })),
          null,
          2
        );

      case 'get_market_stats':
        const stats = await getCarStats();
        return JSON.stringify(stats, null, 2);

      case 'web_search':
        const searchQuery = toolCall.parameters.query || '';
        const maxResults = toolCall.parameters.max_results || 5;
        
        if (!searchQuery) {
          return 'Error: No search query provided';
        }
        
        console.log('[LLM] executing native Ollama web_search for:', searchQuery);
        
        try {
          // Use native Ollama webSearch method with API key
          const searchResponse = await ollama.webSearch({
            query: searchQuery,
            maxResults: Math.min(maxResults, 10)
          });
          
          if (!searchResponse.results || searchResponse.results.length === 0) {
            return `No web search results found for "${searchQuery}". Try rephrasing the query or searching for more general terms.`;
          }
          
          let summary = `Web search results for "${searchQuery}":\n\n`;
          searchResponse.results.forEach((result: any, index: number) => {
            summary += `${index + 1}. ${result.title}\n`;
            summary += `   ${result.content}\n`;
            if (result.url) {
              summary += `   Source: ${result.url}\n`;
            }
            summary += '\n';
          });
          
          console.log('[LLM] web_search returned', searchResponse.results.length, 'results');
          return summary;
          
        } catch (webError: any) {
          console.error('[LLM] native web_search error:', webError.message);
          return `Web search error: ${webError.message}. The search functionality may require an Ollama API key to be configured.`;
        }

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
    const hasModel = models.some((m: any) => m.name.includes(MODEL_NAME));

    if (!hasModel) {
      return {
        success: false,
        message:
          `Connected to Ollama, but ${MODEL_NAME} model not found. Available models: ` +
          models.map((m: any) => m.name).join(', '),
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Ollama',
      model: MODEL_NAME,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to connect to Ollama: ${error.message}. Make sure Ollama is running on localhost:11434`,
    };
  }
};

// Streaming chat with async generator for Server-Sent Events
// Yields chunks in real-time as they arrive from Ollama
export async function* chatStream(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): AsyncGenerator<any, void, unknown> {
  try {
    console.log('[LLM STREAM] chatStream called', {
      userMessage,
      historyLength: conversationHistory.length,
    });

    // Yield immediate thinking indicator
    yield {
      type: 'thinking',
      message: 'Analyzing your question...',
    };

    // Gather context before main LLM call
    console.log('[LLM STREAM] About to call gatherContext...');
    const context = await gatherContext(userMessage);
    console.log('[LLM STREAM] gatherContext returned:', context);
    
    let enrichedMessage = userMessage;
    let contextMessage = '';
    
    if (context.webContext || context.databaseContext || context.marketContext) {
      yield {
        type: 'thinking',
        message: 'Gathering relevant information...',
      };
      
      // Build context message with explicit instructions
      if (context.databaseContext) {
        contextMessage += `DATABASE RESULTS (ALREADY RETRIEVED):\n${context.databaseContext}\n\nIMPORTANT: Present these results to the user naturally. Do not explain tools or say "I can search" - the data is already here above.\n\n`;
      }
      
      if (context.webContext) {
        contextMessage += `Background information:\n${context.webContext}\n\n`;
      }
      
      if (context.marketContext) {
        contextMessage += `${context.marketContext}\n\n`;
      }
      
      console.log('[LLM STREAM] Context gathered:', {
        hasWebContext: !!context.webContext,
        hasDatabaseContext: !!context.databaseContext,
        hasMarketContext: !!context.marketContext,
        contextLength: contextMessage.length,
      });
    }

    // Build messages array with optional context
    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
    ];
    
    // If we have database context, inject it as a system message
    if (contextMessage) {
      messages.push({ 
        role: 'system', 
        content: `CONTEXT FOR CURRENT QUERY:\n${contextMessage}` 
      });
    }
    
    messages.push({ role: 'user', content: enrichedMessage });

    console.log('[LLM STREAM] starting Ollama stream...');

    const stream = await ollama.chat({
      model: MODEL_NAME,
      messages: messages,
      tools: tools,
      stream: true,
      options: {
        num_predict: NUM_PREDICT,
        num_ctx: NUM_CTX,
        num_gpu: NUM_GPU_LAYERS,
        temperature: 0.3,
        top_k: 40,
        top_p: 0.9,
        repeat_penalty: 1.1,
      }
    });

    let fullResponse = '';
    let toolCalls: any[] = [];
    let hasYieldedContent = false;
    let chunkCount = 0;
    let contentChunks = 0;
    let finalChunkCount = 0;
    let finalContentChunks = 0;
    
    // Process the stream
    for await (const chunk of stream) {
      chunkCount++;

      // Check if this chunk contains tool calls
      if (chunk.message?.tool_calls && chunk.message.tool_calls.length > 0) {
        // Store tool calls but don't stop processing
        if (toolCalls.length === 0) {
          toolCalls = chunk.message.tool_calls;
          console.log('[LLM STREAM] tool calls detected', toolCalls.length, toolCalls);
          
          // Notify client that tools are being called
          for (const toolCall of toolCalls) {
            const fn: any = toolCall.function || {};
            const toolName = fn.name || 'unknown';
            
            let statusMessage = 'Using tool...';
            if (toolName === 'search_car_database') {
              statusMessage = 'Searching local database...';
            } else if (toolName === 'web_search') {
              statusMessage = 'Searching the web...';
            } else if (toolName === 'get_market_stats') {
              statusMessage = 'Getting market statistics...';
            }
            
            yield {
              type: 'tool_call',
              tool: toolName,
              message: statusMessage,
              parameters: fn.arguments,
            };
          }
        }
      }

      // Regular content chunk - yield even if we have tool calls
      if (chunk.message?.content) {
        const content = chunk.message.content;
        fullResponse += content;
        hasYieldedContent = true;
        contentChunks++;
        
        yield {
          type: 'content',
          content: content,
        };
      }
      
      // DEBUGGING: Check if model is using thinking tokens instead of content
      if (!chunk.message?.content && chunk.message?.thinking) {
        console.log('[LLM STREAM] Model using thinking tokens:', chunk.message.thinking);
      }
    }

    console.log('[LLM STREAM] initial stream complete', {
      chunks: chunkCount,
      contentChunks: contentChunks,
      responseLength: fullResponse.length,
      toolCalls: toolCalls.length,
    });

    // If tools were called, execute them and get final response
    if (toolCalls.length > 0) {
      console.log('[LLM STREAM] executing', toolCalls.length, 'tools...');
      
      const toolMessages: any[] = [];
      
      for (const call of toolCalls) {
        const fn: any = call.function || {};
        const name: string = fn.name || 'unknown_tool';
        const callId: string = call.id || 'unknown_id';
        let args: any = fn.arguments ?? {};

        if (typeof args === 'string') {
          try {
            args = JSON.parse(args);
          } catch {}
        }

        // Notify client which tool is executing
        let executingMessage = `Executing ${name}...`;
        if (name === 'search_car_database') {
          executingMessage = 'Searching database...';
        } else if (name === 'web_search') {
          executingMessage = 'Searching the web...';
        } else if (name === 'get_market_stats') {
          executingMessage = 'Calculating statistics...';
        }
        
        yield {
          type: 'tool_executing',
          tool: name,
          message: executingMessage,
          parameters: args,
        };

        console.log('[LLM STREAM] executing tool:', name, JSON.stringify(args).slice(0, 100));
        const toolResult = await executeTool({ name, parameters: args });
        console.log('[LLM STREAM] tool result length:', toolResult.length);
        console.log('[LLM STREAM] tool result preview:', toolResult.slice(0, 200));
        
        // Notify client of tool result
        yield {
          type: 'tool_result',
          tool: name,
          message: 'Processing results...',
          result: toolResult.slice(0, 200) + (toolResult.length > 200 ? '...' : ''),
        };

        // Ollama expects 'tool' role with call metadata
        toolMessages.push({
          role: 'tool',
          content: toolResult,
          name: name,
          tool_call_id: callId,
        });
      }

      // Get final response after tool execution
      const messagesWithTools: any[] = [
        ...messages,
        { role: 'assistant', content: '', tool_calls: toolCalls },
        ...toolMessages,
      ];

      console.log('[LLM STREAM] messages for final response:', JSON.stringify(messagesWithTools, null, 2).slice(0, 500));

      yield {
        type: 'generating',
        message: 'Analyzing results and generating response...',
      };

      console.log('[LLM STREAM] getting final response after tools...');
      const finalStream = await ollama.chat({
        model: MODEL_NAME,
        messages: messagesWithTools,
        stream: true,
        options: {
          num_predict: NUM_PREDICT,
          num_ctx: NUM_CTX,
          num_gpu: NUM_GPU_LAYERS,
          temperature: 0.4,
          top_k: 40,
          top_p: 0.9,
          repeat_penalty: 1.1,
        }
      });

      let finalResponseReceived = false;
      
      for await (const chunk of finalStream) {
        finalChunkCount++;
        if (chunk.message?.content) {
          const content = chunk.message.content;
          fullResponse += content;
          hasYieldedContent = true;
          finalResponseReceived = true;
          finalContentChunks++;
          
          yield {
            type: 'content',
            content: content,
          };
        }
      }
      
      console.log('[LLM STREAM] final stream complete', {
        chunks: finalChunkCount,
        contentChunks: finalContentChunks,
      });
      
      // If tools were executed but model didn't generate a response, create a summary
      if (!finalResponseReceived && toolMessages.length > 0) {
        console.warn('[LLM STREAM] Model did not respond after tool execution. Providing formatted tool results.');
        
        // Try to parse and format the tool results nicely
        let formattedResults = '';
        for (const toolMsg of toolMessages) {
          const toolName = toolMsg.name || 'unknown';
          const content = toolMsg.content;
          
          try {
            // Try to parse as JSON for structured data
            const parsed = JSON.parse(content);
            
            if (toolName === 'search_car_database' && Array.isArray(parsed)) {
              if (parsed.length === 0) {
                formattedResults += 'No vehicles found matching your criteria.\n\n';
              } else {
                formattedResults += `Found ${parsed.length} vehicle(s):\n\n`;
                parsed.forEach((car: any, idx: number) => {
                  formattedResults += `**${idx + 1}. ${car.year} ${car.manufacturer} ${car.model}**\n`;
                  formattedResults += `- Price: $${car.price?.toLocaleString() || 'N/A'}\n`;
                  if (car.mileage) formattedResults += `- Mileage: ${car.mileage.toLocaleString()} km\n`;
                  if (car.condition) formattedResults += `- Condition: ${car.condition}\n`;
                  if (car.location) formattedResults += `- Location: ${car.location}\n`;
                  formattedResults += '\n';
                });
              }
            } else if (typeof parsed === 'object') {
              formattedResults += `**${toolName} results:**\n\n`;
              formattedResults += JSON.stringify(parsed, null, 2) + '\n\n';
            } else {
              formattedResults += content + '\n\n';
            }
          } catch {
            // Not JSON, use as-is
            formattedResults += content + '\n\n';
          }
        }
        
        hasYieldedContent = true;
        
        yield {
          type: 'content',
          content: formattedResults || 'Tool executed but no results were returned.',
        };
      }
    }

    console.log('[LLM STREAM] all streams complete', {
      totalLength: fullResponse.length,
      totalChunks: chunkCount + finalChunkCount,
      contentChunks: contentChunks + finalContentChunks,
    });

    // If no content was yielded at all, send an error
    if (!hasYieldedContent && fullResponse.length === 0) {
      console.error('[LLM STREAM] No content generated!');
      yield {
        type: 'error',
        message: 'The model did not generate a response. Please try rephrasing your question.',
      };
    }

  } catch (error: any) {
    console.error('[LLM STREAM] error:', error);
    yield {
      type: 'error',
      message: `Failed to stream response: ${error.message}`,
    };
  }
}
