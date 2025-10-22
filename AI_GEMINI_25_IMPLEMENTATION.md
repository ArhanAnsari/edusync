# 📚 Gemini 2.5 Integration Documentation

## Overview

This document outlines the implementation of Google's Gemini 2.5 models in the EduSync platform's AI services. The integration leverages the Vercel AI SDK to provide enhanced AI capabilities across all EduSync features.

## 🔄 Changes Made

### 1. Model Initialization Updates

```typescript
// Updated to use Gemini 2.5 models with fallback options
function getModel() {
  // Try to use Gemini 2.5 Flash (primary choice for balance of speed and quality)
  try {
    return google('gemini-2.5-flash', {
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
  } catch (error) {
    // First fallback to Gemini 2.5 Pro (for more complex reasoning if Flash is unavailable)
    try {
      return google('gemini-2.5-pro', {
        apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
    } catch (secondError) {
      // Second fallback to a stable model if 2.5 isn't available
      console.warn("Failed to initialize Gemini 2.5 models, falling back to older version");
      return google('gemini-2.0-flash', {
        apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
    }
  }
}
```

This change ensures that:
- Gemini 2.5 Flash is tried first (best balance of speed and quality for most use cases)
- Falls back to Gemini 2.5 Pro if Flash is unavailable (for more complex reasoning)
- Finally falls back to Gemini 2.0 Flash if both 2.5 models are unavailable

### 2. Added Gemini 2.5 Features

#### Thinking Capabilities

Implemented Gemini 2.5's thinking capabilities for the chat assistant:

```typescript
return await streamText({
  model,
  system: systemPrompt,
  messages,
  temperature: 0.7,
  maxTokens: 1024,
  providerOptions: {
    google: {
      // Enable thinking capabilities for Gemini 2.5 models
      thinkingConfig: {
        thinkingBudget: 8192,
        includeThoughts: false, // Don't include thoughts in response to users
      },
      // Safety settings
      safetySettings: [
        // Safety settings configuration
      ]
    }
  }
});
```

Benefits:
- More thoughtful and reasoned responses
- Better multi-step reasoning for complex educational topics
- 8192 token thinking budget to handle complex educational concepts

#### Safety Settings

Added comprehensive safety settings to ensure appropriate content:

```typescript
safetySettings: [
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  }
]
```

Benefits:
- Appropriate content for educational contexts
- Consistent with educational guidelines
- Protection against potentially harmful content

### 3. Enhanced Error Handling

#### Common Error Categories

Updated error handling across all AI functions to include Gemini 2.5 specific errors:

```typescript
// Authentication errors
if (errorMessage.includes('API key') || errorMessage.includes('401')) {
  throw new Error('AI service authentication failed. Please check configuration.');
}

// Rate limit errors
if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
  throw new Error('AI service rate limit exceeded. Please try again later.');
}

// Timeout errors
if (errorMessage.includes('timeout') || errorMessage.includes('DEADLINE_EXCEEDED')) {
  throw new Error('AI service timeout. The response took too long. Please try again.');
}

// Safety filter errors
if (errorMessage.includes('safety') || errorMessage.includes('block') || errorMessage.includes('harmful')) {
  throw new Error('Content blocked by AI safety filters. Please modify your request.');
}

// Thinking budget errors (Gemini 2.5 specific)
if (errorMessage.includes('thinking') || errorMessage.includes('budget')) {
  throw new Error('AI thinking process exceeded limits. Please simplify your request.');
}

// Model availability errors
if (errorMessage.includes('model') || errorMessage.includes('not available')) {
  throw new Error('Selected AI model is currently unavailable. System will try to use an alternative model.');
}

// Schema errors (important for structured outputs)
if (errorMessage.includes('schema') || errorMessage.includes('properties')) {
  throw new Error('Schema error with AI service. Please check the format of your request.');
}
```

#### HTTP Status Mapping

Enhanced API routes to use appropriate HTTP status codes for Gemini-specific errors:

```typescript
// Authentication errors: 503 Service Unavailable
if (errorMessage.includes('API key') || errorMessage.includes('401')) {
  statusCode = 503;
  userMessage = 'AI service authentication failed';
}

// Rate limiting: 429 Too Many Requests
else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
  statusCode = 429;
  userMessage = 'AI service rate limited. Please try again later.';
}

// Timeouts: 504 Gateway Timeout
else if (errorMessage.includes('timeout') || errorMessage.includes('DEADLINE_EXCEEDED')) {
  statusCode = 504;
  userMessage = 'AI service timeout. Please try again.';
}

// Safety filter blocks: 400 Bad Request
else if (errorMessage.includes('safety') || errorMessage.includes('block') || errorMessage.includes('harmful')) {
  statusCode = 400;
  userMessage = 'Content blocked by AI safety filters. Please modify your request.';
}

// Thinking budget exceeded: 413 Payload Too Large
else if (errorMessage.includes('thinking') || errorMessage.includes('budget')) {
  statusCode = 413;
  userMessage = 'Request too complex. Please simplify your question.';
}

// Model availability: 503 Service Unavailable
else if (errorMessage.includes('model') || errorMessage.includes('not available')) {
  statusCode = 503;
  userMessage = 'AI model temporarily unavailable. System will try an alternative.';
}
```

## 📋 Model Capabilities & Comparison

### Gemini 2.5 Pro
- **Strengths**: Most capable, best reasoning, best educational explanations
- **Use Cases**: Complex educational topics, multi-step problem solving, generating detailed educational content
- **Performance**: Highest quality, slightly slower response time
- **Tokens**: Supports larger context (up to 1M tokens)

### Gemini 2.5 Flash
- **Strengths**: Fast responses, good balance of speed and quality, almost as capable as Pro
- **Use Cases**: Chat, quick explanations, most general educational use cases
- **Performance**: Good quality, fast response time
- **Tokens**: Large context (up to 1M tokens)

### Gemini 2.0 Flash (Fallback)
- **Strengths**: Stable, reliable, wide availability
- **Use Cases**: Basic educational tasks when 2.5 models are unavailable
- **Performance**: Standard quality, fast response time
- **Tokens**: Standard context size

## ⚙️ Configuration

### Environment Variables

No changes required to existing environment variables. The system uses:
```
GEMINI_API_KEY=your_api_key
```
or
```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

### Fallback Strategy

The system tries to use models in this order:
1. `gemini-2.5-flash` (best balance of speed and quality)
2. `gemini-2.5-pro` (more powerful for complex reasoning)
3. `gemini-2.0-flash` (stable fallback)

## 🚀 Usage Examples

### Chat Assistant

```typescript
const result = await chatWithAssistant(messages, context);
```

### Quiz Generation

```typescript
const questions = await generateQuizQuestions(topic, numberOfQuestions, difficulty);
```

## 🧪 Testing Recommendations

- Test with complex educational topics to leverage Gemini 2.5's reasoning
- Verify safety filters with boundary test cases
- Test fallback behavior by temporarily configuring invalid model names
- Test thinking budget limits with very complex questions

## 📚 Resources

- [Vercel AI SDK Google Documentation](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)
- [Gemini 2.5 Models Documentation](https://ai.google.dev/gemini-api/docs/models)
- [Thinking Process Documentation](https://ai.google.dev/gemini-api/docs/thinking)

## ⚠️ Known Limitations

- Schema limitations: Gemini has limited support for complex Zod schemas (e.g., unions and records)
- Structured output issues: May occur with extremely complex schema definitions
- Safety filters: May block some legitimate educational content (physics, biology, etc.)
- Thinking budget: Complex reasoning has token limits

## 🔮 Future Enhancements

- Implement explicit caching for cost optimization
- Add file input support for document analysis
- Leverage URL context for current educational resources
- Consider implementing Google Search grounding for up-to-date information