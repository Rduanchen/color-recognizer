import * as FileSystem from 'expo-file-system';
import { decode } from 'jpeg-js';

// 取得圖片某一點的 HEX 色碼
export async function getPixelColor(photoUri: string, x: number, y: number) {
  // 這裡是簡化範例，實際需處理 base64 或 buffer
  const data = await FileSystem.readAsStringAsync(photoUri, { encoding: FileSystem.EncodingType.Base64 });
  const jpegData = decode(Buffer.from(data, 'base64'));
  const idx = (y * jpegData.width + x) * 4;
  const [r, g, b] = [jpegData.data[idx], jpegData.data[idx + 1], jpegData.data[idx + 2]];
  return rgbToHex(r, g, b);
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}