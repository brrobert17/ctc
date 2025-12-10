import axios from 'axios';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export const searchWeb = async (query: string): Promise<SearchResult[]> => {
  try {
    // Using DuckDuckGo Instant Answer API (free, no API key required)
    const response = await axios.get('https://api.duckduckgo.com/', {
      params: {
        q: query,
        format: 'json',
        no_html: 1,
        skip_disambig: 1,
      },
      timeout: 10000,
    });

    const results: SearchResult[] = [];

    // Extract abstract if available
    if (response.data.Abstract) {
      results.push({
        title: response.data.Heading || 'Result',
        url: response.data.AbstractURL || '',
        snippet: response.data.Abstract,
      });
    }

    // Extract related topics
    if (response.data.RelatedTopics && Array.isArray(response.data.RelatedTopics)) {
      response.data.RelatedTopics.slice(0, 5).forEach((topic: any) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || 'Related',
            url: topic.FirstURL,
            snippet: topic.Text,
          });
        }
      });
    }

    return results;
  } catch (error) {
    console.error('Web search error:', error);
    return [
      {
        title: 'Search Error',
        url: '',
        snippet: 'Unable to perform web search at this time. Please try again later.',
      },
    ];
  }
};

export const searchCarReviews = async (
  manufacturer: string,
  model: string,
  year?: string
): Promise<string> => {
  const query = `${manufacturer} ${model} ${year || ''} owner reviews reliability problems`;
  const results = await searchWeb(query);

  if (results.length === 0) {
    return 'No reviews found for this vehicle.';
  }

  let summary = `Web search results for "${manufacturer} ${model}":\n\n`;
  results.forEach((result, index) => {
    summary += `${index + 1}. ${result.title}\n`;
    summary += `   ${result.snippet}\n`;
    if (result.url) {
      summary += `   Source: ${result.url}\n`;
    }
    summary += '\n';
  });

  return summary;
};
