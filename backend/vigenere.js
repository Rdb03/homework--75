const express = require("express");
const cors = require("cors");
const { Vigenere } = require("caesar-salad");

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.post('/encode', async (req, res) => {
    try {
        const textToEncode = req.body.encode;
        console.log(textToEncode);
        const encodedText = Vigenere.Cipher(req.body.password).crypt(textToEncode);
        res.send(encodedText);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/decode', async (req, res) => {
    try {
        const textToDecode = req.body.decode;
        const decodedText = Vigenere.Decipher(req.body.password).crypt(textToDecode);
        res.send(decodedText);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const run = async () => {
    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

void run();
