const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// Available AI models configuration
const AI_MODELS = {
    // Google Gemini models
    'gemini-2.0-flash-exp': {
        provider: 'google',
        name: 'Gemini 2.0 Flash Exp',
        description: 'Fast and efficient Google model',
        icon: '🚀',
        color: 'from-blue-500 to-cyan-500'
    },
    
    // OpenRouter models
    'deepseek-chat-v3': {
        provider: 'openrouter',
        model: 'deepseek/deepseek-chat-v3-0324:free',
        name: 'DeepSeek Chat V3',
        description: 'Advanced reasoning and chat capabilities',
        icon: '🧠',
        color: 'from-purple-500 to-pink-500'
    },
    'deepseek-r1': {
        provider: 'openrouter',
        model: 'deepseek/deepseek-r1-0528:free',
        name: 'DeepSeek R1',
        description: 'Optimized for complex reasoning tasks',
        icon: '🔬',
        color: 'from-indigo-500 to-purple-500'
    },
    'gemini-openrouter': {
        provider: 'openrouter',
        model: 'google/gemini-2.0-flash-exp:free',
        name: 'Gemini 2.0 Flash (OpenRouter)',
        description: 'Google Gemini via OpenRouter',
        icon: '⚡',
        color: 'from-green-500 to-teal-500'
    },
    'qwen3-235b': {
        provider: 'openrouter',
        model: 'qwen/qwen3-235b-a22b:free',
        name: 'Qwen3 235B',
        description: 'Large language model with extensive knowledge',
        icon: '🌟',
        color: 'from-orange-500 to-red-500'
    }
};

// Google Gemini setup (existing)
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const CodeGenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 10192,
    responseMimeType: "application/json",
};

const EnhancePromptConfig = {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1000,
    responseMimeType: "text/plain",
};

// OpenRouter API client with improved error handling and retry logic
class OpenRouterClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = OPENROUTER_BASE_URL;
    }

    async sendMessage(model, messages, config = {}, retries = 2) {
        if (!this.apiKey) {
            throw new Error('OpenRouter API key not configured. Please add NEXT_PUBLIC_OPENROUTER_API_KEY to your environment variables.');
        }

        const requestBody = {
            model: model,
            messages: Array.isArray(messages) ? messages : [{ role: 'user', content: messages }],
            temperature: config.temperature || 0.7,
            max_tokens: config.maxOutputTokens || 4096,
            top_p: config.topP || 0.9,
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: false
        };

        // Add response format for JSON requests
        if (config.responseMimeType === "application/json") {
            requestBody.response_format = { type: "json_object" };
        }

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(`${this.baseURL}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                        'X-Title': 'LanSoft Dev - AI Website Builder'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorData;
                    
                    try {
                        errorData = JSON.parse(errorText);
                    } catch {
                        errorData = { error: { message: errorText } };
                    }

                    // Handle rate limiting with exponential backoff
                    if (response.status === 429 && attempt < retries) {
                        const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
                        console.log(`Rate limited, retrying in ${waitTime}ms...`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        continue;
                    }

                    // Provide more specific error messages
                    if (response.status === 429) {
                        throw new Error(`Rate limit exceeded for model ${model}. Please try again later or use a different model.`);
                    } else if (response.status === 401) {
                        throw new Error('Invalid OpenRouter API key. Please check your NEXT_PUBLIC_OPENROUTER_API_KEY environment variable.');
                    } else if (response.status === 402) {
                        throw new Error('Insufficient credits for OpenRouter API. Please check your account balance.');
                    } else {
                        throw new Error(`OpenRouter API error (${response.status}): ${errorData.error?.message || errorText}`);
                    }
                }

                const data = await response.json();
                
                if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                    throw new Error('Invalid response format from OpenRouter API');
                }

                return {
                    response: {
                        text: () => data.choices[0].message.content || ''
                    }
                };

            } catch (error) {
                if (attempt === retries) {
                    throw error;
                }
                
                // Only retry on network errors or 5xx server errors
                if (error.message.includes('fetch') || error.message.includes('network')) {
                    const waitTime = Math.pow(2, attempt) * 1000;
                    console.log(`Network error, retrying in ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
                
                throw error;
            }
        }
    }
}

// Create OpenRouter client instance
const openRouterClient = new OpenRouterClient(OPENROUTER_API_KEY);

// AI Session class to handle different providers
class AISession {
    constructor(modelId = 'gemini-2.0-flash-exp', config = {}) {
        this.modelId = modelId;
        this.modelConfig = AI_MODELS[modelId];
        this.config = config;
        this.history = [];
        
        if (!this.modelConfig) {
            throw new Error(`Model ${modelId} not found in configuration`);
        }

        // Initialize provider-specific session
        if (this.modelConfig.provider === 'google') {
            this.session = model.startChat({
                generationConfig: this.config,
                history: []
            });
        }
    }

    async sendMessage(prompt) {
        try {
            if (this.modelConfig.provider === 'google') {
                return await this.session.sendMessage(prompt);
            } else if (this.modelConfig.provider === 'openrouter') {
                // Convert prompt to messages format if needed
                let messages;
                if (typeof prompt === 'string') {
                    messages = [{ role: 'user', content: prompt }];
                } else if (Array.isArray(prompt)) {
                    messages = prompt.map(p => ({ role: 'user', content: p }));
                } else {
                    messages = [prompt];
                }

                return await openRouterClient.sendMessage(
                    this.modelConfig.model,
                    messages,
                    this.config
                );
            }
        } catch (error) {
            console.error(`Error with ${this.modelId}:`, error);
            
            // Provide user-friendly error messages
            if (error.message.includes('Rate limit')) {
                throw new Error(`The ${this.modelConfig.name} model is currently rate-limited. Please try again in a few moments or select a different model.`);
            } else if (error.message.includes('API key')) {
                throw new Error(`API configuration issue with ${this.modelConfig.name}. Please check your API keys.`);
            } else {
                throw new Error(`Error with ${this.modelConfig.name}: ${error.message}`);
            }
        }
    }
}

// Create default sessions (backward compatibility)
export const chatSession = new AISession('gemini-2.0-flash-exp', generationConfig);
export const GenAiCode = new AISession('gemini-2.0-flash-exp', CodeGenerationConfig);
export const enhancePromptSession = new AISession('gemini-2.0-flash-exp', EnhancePromptConfig);

// Export AI models configuration and session creator
export { AI_MODELS };

// Function to create a session with specific model
export const createAISession = (modelId, config = {}) => {
    return new AISession(modelId, config);
};

// Function to get available models
export const getAvailableModels = () => {
    return Object.entries(AI_MODELS).map(([id, config]) => ({
        id,
        ...config
    }));
};

// Function to check if OpenRouter is configured
export const isOpenRouterConfigured = () => {
    return !!OPENROUTER_API_KEY;
};

// Function to test OpenRouter connection
export const testOpenRouterConnection = async () => {
    if (!OPENROUTER_API_KEY) {
        return { success: false, error: 'API key not configured' };
    }

    try {
        const testClient = new OpenRouterClient(OPENROUTER_API_KEY);
        await testClient.sendMessage('deepseek/deepseek-chat-v3-0324:free', 'Hello', { maxOutputTokens: 10 });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};