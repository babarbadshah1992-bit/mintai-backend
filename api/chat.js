export default async function handler(req, res) {

  // test route
  if (req.method === "GET") {
    return res.status(200).json({ status: "MintAI backend running 🚀" });
  }

  try {
    const { message } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({ error: "API KEY MISSING" });
    }

    return res.status(200).json({
      reply: "Backend connected successfully 🎉"
    });

  } catch (err) {
    return res.status(200).json({
      error: err.message
    });
  }
}
