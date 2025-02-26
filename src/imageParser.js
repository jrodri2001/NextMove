import axios from 'axios';
import fs from 'fs';

const API_ENDPOINT = 'http://app.chessvision.ai/predict/';

const DEFAULT_PAYLOAD = {
  cropped: true,
  current_player: "white",
  board_orientation: "predict",
  predict_turn: true
};

export function imageToBase64(filePath) {
  // Read the image file as a binary buffer
  const imageBuffer = fs.readFileSync(filePath);
  // Convert the buffer to a base64-encoded string
  const base64String = imageBuffer.toString('base64');
  // Determine the MIME type of the image (e.g., 'image/jpeg', 'image/png')
  const mimeType = `image/${filePath.split('.').pop()}`;
  // Return the base64 string in the desired format
  return `data:${mimeType};base64,${base64String}`;
}

export async function getFENfromImage(base64Image) {
  try {
    const payload = {
      ...DEFAULT_PAYLOAD,
      image: base64Image
    };
    
    const response = await axios.post(API_ENDPOINT, payload);
    
    if (response?.data?.success && response.data.result) {
      return response.data.result.replace(/_/g,' ');
    }
    
    throw new Error("Invalid response format from API");
  } catch (error) {
    console.error('Error:', error.message);
    throw new Error("Couldn't get a response from API");
  }
}