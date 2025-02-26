// chessEngine.js
import { exec } from 'child_process';

// Function to get best move using Stockfish
export async function getBestMove(fen) {
  return new Promise((resolve, reject) => {
    const stockfish = exec('stockfish');
    let isResolved = false;

    stockfish.stdin.write('uci\n');
    stockfish.stdin.write('isready\n');
    stockfish.stdin.write(`position fen ${fen}\n`);
    stockfish.stdin.write('go depth 18\n');

    let bestMove = '';
    const timeout = setTimeout(() => {
      if (!isResolved) {
        stockfish.kill();
        reject(new Error('Engine timeout - Please ensure Stockfish is responding'));
      }
    }, 15000);

    stockfish.stdout.on('data', (data) => {
      console.log(data);
      const match = data.match(/bestmove (\w+)/);
      if (match && !isResolved) {
        clearTimeout(timeout);
        bestMove = match[1];
        isResolved = true;
        stockfish.kill();
        resolve(bestMove);
      }
    });

    stockfish.stderr.on('data', (data) => {
      console.error(`Stockfish Error: ${data}`);
    });

    stockfish.on('error', (error) => {
      if (!isResolved) {
        clearTimeout(timeout);
        isResolved = true;
        reject(new Error(`Stockfish process error: ${error.message}`));
      }
    });

    stockfish.on('exit', () => {
      if (!isResolved) {
        clearTimeout(timeout);
        reject(new Error('Engine terminated unexpectedly'));
      }
    });
  });
}