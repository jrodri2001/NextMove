import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { getBestMove } from "../chessEngine.js";
import {getFENfromImage, imageToBase64} from "../imageParser.js";

const app = express();
const port = 3000;
const upload = multer({ dest: "uploads/" });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Not implemented yet");
});

app.post("/nextMove", async (req, res) => {
    const { fen } = req.body;

    if (!fen) {
        return res.status(400).json({ error: "FEN string is required." });
    }

    try {
        const bestMove = await getBestMove(fen);
        res.json({ bestMove });
    } catch (error) {
        console.error("Error calculating best move:", error.message);
        res.status(500).json({ error: "Failed to calculate best move." });
    }
});

app.post("/parseImage", upload.single("image"), async (req, res) => {
    const { turn } = req.body;
    const playerTurn = turn === "b" ? "b" : "w";

    if (!req.file) {
        return res.status(400).json({ error: "An image is required" });
    }

    try {
        const image = imageToBase64(req.file.path);
        const fen = await getFENfromImage(image);
        const bestMove = await getBestMove(fen);

        res.json({
            fen,
            turn: playerTurn,
            bestMove
        });
    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: `Failed to process image: ${error.message}` });
    }
});

// Only start the server if this file is run directly
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`NextMove app listening on port ${port}!`));
}

export default app;
