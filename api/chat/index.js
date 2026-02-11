export default async function handler(req, res) {

  // CORS allow
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `You are a helpful beauty and skincare assistant. User question: ${message}`
      }),
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.output[0].content[0].text
    });

  } catch (error) {
    res.status(200).json({ reply: "Server error" });
  }
}
