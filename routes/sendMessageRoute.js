const express = require('express');
const router = express.Router();
require('dotenv').config();

const { chatCompletion } = require('../helper/geminiApi');
const { sendMessage, setTypingOff, setTypingOn } = require('../helper/messengerApi');

router.post('/', async (req, res) => {
  try {
    let body = req.body;
    console.log(body);
    let senderId = body.senderId;
    console.log(senderId);
    let query = body.query;
    await setTypingOn(senderId);
    let result = await chatCompletion(query);
    await sendMessage(senderId, result.response);
    await setTypingOff(senderId);
    
  } catch (error) {
    console.log(error);
  }
  res.status(200).send('OK');
});

router.get('/', async (req, res) => {
  const message = req.query['message'];

  if (!message) {
    return res.status(400).send('Missing message parameter'); 
  }

  try {
    const result = await chatCompletion(message);

    if (result.status) {
      // Create a simple HTML page with the response text
      const htmlResponse = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Gemini Response</title>
        </head>
        <body>
          <h1>Gemini Response</h1>
          <pre>${result.response}</pre>
        </body>
        </html>
      `;

      res.status(200).send(htmlResponse);
    } else {
      res.sendStatus(500); 
    }
  } catch (error) {
    console.error(error); 
    res.sendStatus(500); 
  }
});

module.exports = {
  router
};