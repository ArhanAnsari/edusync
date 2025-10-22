/**
 * AI Service Diagnostic Script
 * Tests all AI service endpoints and identifies issues
 */

import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';

async function testAIService() {
  console.log('🔍 Starting AI Service Diagnostic...\n');

  // Test 1: Check API Key
  console.log('1️⃣  Checking API Keys...');
  const geminiKey = process.env.GEMINI_API_KEY;
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!geminiKey && !googleKey) {
    console.error('❌ CRITICAL: No API key found!');
    console.error('   GEMINI_API_KEY:', geminiKey ? '✓ Set' : '❌ Not set');
    console.error('   GOOGLE_GENERATIVE_AI_API_KEY:', googleKey ? '✓ Set' : '❌ Not set');
    process.exit(1);
  }
  
  console.log('   ✓ GEMINI_API_KEY:', geminiKey ? `${geminiKey.slice(0, 10)}...` : 'Not set');
  console.log('   ✓ GOOGLE_GENERATIVE_AI_API_KEY:', googleKey ? `${googleKey.slice(0, 10)}...` : 'Not set');

  // Test 2: Initialize Model
  console.log('\n2️⃣  Initializing Gemini Model...');
  try {
    const model = google('gemini-2.0-flash');
    console.log('   ✓ Model initialized successfully');
  } catch (error) {
    console.error('❌ Model initialization failed:', error);
    process.exit(1);
  }

  // Test 3: Simple Text Generation
  console.log('\n3️⃣  Testing Simple Text Generation...');
  try {
    const model = google('gemini-2.0-flash');
    const { text } = await generateText({
      model,
      prompt: 'Say "AI Service is working!" in exactly 5 words.',
      maxOutputTokens: 100,
    });
    
    console.log('   ✓ Response received:', text);
  } catch (error) {
    console.error('❌ Text generation failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  // Test 4: Stream Test
  console.log('\n4️⃣  Testing Stream Response...');
  try {
    const model = google('gemini-2.0-flash');
    const response = await streamText({
      model,
      prompt: 'Count from 1 to 5 on separate lines.',
      maxOutputTokens: 100,
    });

    let streamedText = '';
    const reader = response.textStream.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      streamedText += value;
      process.stdout.write('.');
    }
    
    console.log('\n   ✓ Streaming successful:', streamedText.slice(0, 50) + '...');
  } catch (error) {
    console.error('\n❌ Streaming failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  console.log('\n✅ All AI Service tests passed!');
}

testAIService().catch(console.error);
