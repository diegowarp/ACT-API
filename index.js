const PORT = process.env.PORT || 8000;
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(express.json()); // This is necessary to parse JSON bodies

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Accessibility Content Transformer API' });
});

// Simplifying texts
app.post('/simplify', async (req, res) => {
    const authHeaders = req.headers

    if(authHeaders.secretkey !== process.env.ZUPLOS_API_KEY){
        res.json({message: "Access not authorized."})
        return
    }


    const text = req.body.text; // Destructure text from the request body
    try {

        const prompt = `You are an assistant that was design to help people with cognitive disability or non instructed people to understand complex and difficult content texts. Your goal is to simplify the text without loosing any content or important information. Try to use easier words, examples to explain things and so on. You must follow the same language as the text provided. Here is my text:  ${text}`

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();
        res.json({ simplified_text: content })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to simplify the text due to an internal error.' });
    }
});

// Reducing texts
app.post('/reducer', async (req, res) => {
    const authHeaders = req.headers
    if(authHeaders.secretkey !== "my-ultra-secret-key"){
        res.json({message: "Access not authorized."})
        return
    }
    const text = req.body.text; // Destructure text from the request body
    try {
        const prompt = `You are an assistant that was design to reduce texts and contents. Your only task is to reduce as much as possible the text provided to you without loosing any important information on it. You must follow the same language as the text provided. Here is my text:  ${text}`

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();
        res.json({ reduced_text: content })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to summarize the text due to an internal error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
