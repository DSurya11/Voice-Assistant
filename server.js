const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const Groq = require("groq-sdk");

app.use(express.json());  
app.use(express.static(path.join(__dirname, 'templates'))); 


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});
const groq = new Groq({
  apiKey: "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",
}); 

app.post('/api/ask', async (req, res) => { 
  const userInput = req.body.question;
  
  console.log("User Input Received:", userInput);

  if (!userInput) {
    console.warn("No question provided by the user.");
    return res.status(400).json({ answer: "No question provided." });
  }

  try {
    const chatCompletion = await getGroqChatCompletion(userInput);
    console.log(
      chatCompletion.choices[0]?.message?.content || "No content available.",
    );
    res.json({ answer: chatCompletion.choices[0]?.message?.content || "No response from Groq" });
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message || error);
    res.status(500).json({ answer: "Error processing request" });
  }
});



app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});


  
async function getGroqChatCompletion(input) {
  return groq.chat.completions.create({
    messages: [{ role: "user", content: input }],
    model: "llama3-8b-8192",
  });
}
