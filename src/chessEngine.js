import { spawn } from "child_process";

export function getBestMove(fen) {
    return new Promise((resolve, reject) => {
        const stockfish = spawn("stockfish");

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
                    // Resolve the promise with the best move
                    resolve(bestMove);
                } else {
                    // Reject if no move is found
                    reject(new Error("Failed to extract best move from Stockfish response."));
                }

                // Quit Stockfish after getting the best move
                stockfish.stdin.write("quit\n");
            }
        });

        // Handle errors
        stockfish.on("error", (error) => {
            reject(error);
        });

        // Send initial commands to Stockfish
        sendToStockfish("uci");
        sendToStockfish("isready");
        sendToStockfish(`position fen ${fen}`);
        sendToStockfish("go depth 15");
    });
}