const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load environment variables first

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are very funny assistant named Wandee. You like to give explaination with funny example.",
});
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
const chatCompletion = async (prompt) => {

  const chatSession = model.startChat({
    generationConfig,
    history: [

    ],
  });

  try {
    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text()); // Accessing the generated text
  
    return {
      status: 1,
      response: result.response.text()
    };
  } catch (error) {
    console.log(error);
    return {
      status: 0,
      response: error.message // Accessing the error message
    };
  }
};

module.exports = {
  chatCompletion
};