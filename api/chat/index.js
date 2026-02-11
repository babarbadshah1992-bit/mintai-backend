export default async function handler(req, res) {

  // CORS fix (VERY IMPORTANT)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // GET request support (browser test)
    let userMessage = "";

    if (req.method === "GET") {
      userMessage = req.query.msg || "Hello";
    }

    // POST request support (website chat)
    if (req.method === "POST") {
      userMessage = req.body.message;
    }

    if (!userMessage) {
      return res.status(400).json({ reply: "Message missing" });
    }

    // OpenAI call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful beauty and health assistant for Indian and international users."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Server error" });
  }
}
