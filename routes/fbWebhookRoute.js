const express = require('express');
const router = express.Router();
require('dotenv').config();
const axios = require("axios").default;

router.get('/', async (req, res) => {
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  let test = req.query['hub.test']
  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else if(test) {
    if(test === '123') {
      const host = req.hostname;
      const requestUrl = `https://${host}/sendMessage`;
      console.log(host);
      await callSendMessage(requestUrl, '123', 'hello');
      res.status(200).send(test);
    } else {
      res.sendStatus(403);
    }
  }
});

const callSendMessage = async (url, senderId, query) => {
  let options = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      senderId: senderId,
      query: query
    }
  };
  await axios.request(options)
}

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const senderId = body.value.sender.id;
    const query = body.value.message.text;
    console.log(body);
    
    const host = req.hostname;
    const requestUrl = `https://${host}/sendMessage`;
    console.log(host);

    await callSendMessage(requestUrl, senderId, query);
    console.log(senderId, query);

    res.status(200).send('OK');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = {
  router
};