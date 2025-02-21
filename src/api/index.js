import express from "express";
import bodyParser from "body-parser";
import { getBestMove } from "../chessEngine.js";

const app = express();
const port = 3000;


app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.get('/', (req,res)=>{
    res.send('Not implemented yet');
});


app.post('/nextMove', async (req,res)=>{
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


app.listen(port, () => console.log(`NextMove app listening on port ${port}!`));