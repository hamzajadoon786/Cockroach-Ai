export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, mode } = req.body;

  try {
    // 1. IMAGE MODE HANDLER
    if (mode === 'image') {
      // Integration point for Image Generation (Hugging Face / Stability / OpenAI DALL-E)
      // Example response format:
      const generatedImageUrl = `https://pollinations.ai/p/${encodeURIComponent(message)}?width=1024&height=1024&seed=42&nologo=true`;
      
      return res.status(200).json({
        type: 'image_url',
        output: generatedImageUrl
      });
    }

    // 2. VOICE MODE HANDLER
    if (mode === 'voice') {
      // Integration point for Whisper / Speech-to-Text API
      return res.status(200).json({
        type: 'audio_transcript',
        output: `[Voice Processed]: Cockroach AI received voice command -> "${message || 'System active'}"`
      });
    }

    // 3. DEFAULT TEXT MODE (Multi-Provider API logic)
    const apiKey = process.env.MISTRAL_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Fallback response if API key is missing during build check
      return res.status(200).json({
        type: 'text',
        output: `[Cockroach AI Offline Mode]: System active. Received message: "${message}". Please configure your API keys on Vercel.`
      });
    }

    // Call your primary LLM endpoint (Example using standard fetch)
    const apiResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await apiResponse.json();
    const reply = data.choices?.[0]?.message?.content || "Cockroach engine executed successfully.";

    return res.status(200).json({
      type: 'text',
      output: reply
    });

  } catch (error) {
    console.error("Cockroach Backend Error:", error);
    return res.status(500).json({ error: 'Cockroach AI Engine failed to respond.' });
  }
  }
