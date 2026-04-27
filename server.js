import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <h2>Draxx AI is Live 🚀</h2>
    <form method="POST" action="/test">
      <input name="name" placeholder="Name" required />
      <input name="niche" placeholder="Niche" required />
      <button type="submit">Generate Message</button>
    </form>
  `);
});

// Generate outreach message
app.post("/generate-message", async (req, res) => {
  try {
    const { name, niche } = req.body;

    const prompt = `
You are a friendly assistant for Draxx Systems.

Write a short, casual outreach message to ${name}, who is a ${niche}.
Do not sound salesy. Be helpful and natural.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    res.json({
      message: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// AI reply agent
app.post("/reply", async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are Draxx Systems assistant.

Reply to this message:
"${message}"

Be helpful, friendly, and guide them toward booking a call.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "No reply"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
