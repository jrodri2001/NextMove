import { spawn } from "child_process";
import { Chess } from "chess.js";

const chess = new Chess();

// Start Stockfish process
const stockfish = spawn("stockfish");

console.log("Stockfish engine started...");

// Set up a sample chess position (FEN notation)
const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
chess.load(fen);

// Log the initial position
console.log("Initial Position:");
console.log(chess.ascii());

// Function to send commands to Stockfish
function sendToStockfish(command) {
    stockfish.stdin.write(command + "\n");
}

// Listen for Stockfish output
stockfish.stdout.on("data", (data) => {
    const output = data.toString();

    // Look for best move response
    if (output.includes("bestmove")) {
        const bestMove = output.match(/bestmove (\S+)/)?.[1]; // Extract the actual move

        if (bestMove) {
            console.log("Best Move:", bestMove);

            // Attempt to make the move on the board
            try {
                chess.move(bestMove, { sloppy: true }); // Allow slightly incorrect notation
                console.log("New Position:");
                console.log(chess.ascii());
            } catch (error) {
                console.error("Error making move:", error.message);
            }
        } else {
            console.error("Failed to extract best move from Stockfish response.");
        }

        // Quit Stockfish after getting the best move
        stockfish.stdin.write("quit\n");
    }
});

// Send initial commands to Stockfish
sendToStockfish("uci");
sendToStockfish("isready");
sendToStockfish(`position fen ${chess.fen()}`);
sendToStockfish("go depth 15");
