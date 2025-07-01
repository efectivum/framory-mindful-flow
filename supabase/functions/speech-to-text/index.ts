
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Optimized base64 processing with better memory management
function processBase64Optimized(base64String: string): Uint8Array {
  console.log('Processing base64 string of length:', base64String.length);
  
  if (!base64String || base64String.length === 0) {
    throw new Error('Empty base64 string provided');
  }
  
  try {
    // Use built-in atob for better performance and memory efficiency
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log('Total audio bytes:', bytes.length);
    
    if (bytes.length === 0) {
      throw new Error('No audio data after processing');
    }
    
    return bytes;
  } catch (error) {
    console.error('Base64 processing failed:', error);
    throw new Error(`Failed to process audio data: ${error.message}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now();
  
  try {
    console.log('Speech-to-text function called at:', new Date().toISOString());
    
    const requestBody = await req.json()
    const { audio, language } = requestBody
    
    console.log('Request received:', {
      hasAudio: !!audio,
      audioLength: audio?.length || 0,
      language: language || 'not specified'
    });
    
    if (!audio) {
      console.error('No audio data provided in request');
      throw new Error('No audio data provided')
    }

    if (typeof audio !== 'string') {
      console.error('Audio data is not a string:', typeof audio);
      throw new Error('Audio data must be a base64 string')
    }

    console.log('Processing audio transcription request for language:', language);

    // Check if OpenAI API key is available
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('OpenAI API key not found in environment');
      throw new Error('OpenAI API key not configured');
    }

    console.log('OpenAI API key found, processing audio...');

    // Process audio data
    let binaryAudio: Uint8Array;
    try {
      binaryAudio = processBase64Optimized(audio);
    } catch (error) {
      console.error('Failed to process base64 audio:', error);
      throw new Error(`Failed to process audio data: ${error.message}`);
    }
    
    console.log('Audio processing took:', Date.now() - startTime, 'ms');
    
    // Prepare form data
    const formData = new FormData()
    const blob = new Blob([binaryAudio], { type: 'audio/webm' })
    formData.append('file', blob, 'audio.webm')
    formData.append('model', 'whisper-1')
    
    if (language && language.trim() !== '') {
      formData.append('language', language.trim())
      console.log('Language set to:', language.trim());
    }

    console.log('Sending request to OpenAI Whisper API...');
    const apiStartTime = Date.now();
    
    // Send to OpenAI with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('OpenAI API call took:', Date.now() - apiStartTime, 'ms');
      console.log('OpenAI response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenAI API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`OpenAI API error (${response.status}): ${errorText}`)
      }

      const result = await response.json()
      console.log('Transcription successful:', {
        hasText: !!result.text,
        textLength: result.text?.length || 0,
        textPreview: result.text?.substring(0, 100) || 'no text',
        totalProcessingTime: Date.now() - startTime + 'ms'
      });

      if (!result.text) {
        console.warn('OpenAI returned empty transcription');
        throw new Error('No transcription text received from OpenAI');
      }

      return new Response(
        JSON.stringify({ text: result.text }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try with a shorter recording');
      }
      throw error;
    }

  } catch (error) {
    console.error('Error in speech-to-text function:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      totalTime: Date.now() - startTime + 'ms'
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        details: 'Check function logs for more information'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
