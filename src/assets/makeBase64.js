import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bike = fs.readFileSync(path.join(__dirname, 'bike.png')).toString('base64');
const auto = fs.readFileSync(path.join(__dirname, 'auto.png')).toString('base64');
const car = fs.readFileSync(path.join(__dirname, 'car.png')).toString('base64');
const van = fs.readFileSync(path.join(__dirname, 'van.png')).toString('base64');

const content = `export const BIKE_BASE64 = "data:image/png;base64,${bike}";
export const AUTO_BASE64 = "data:image/png;base64,${auto}";
export const CAR_BASE64 = "data:image/png;base64,${car}";
export const VAN_BASE64 = "data:image/png;base64,${van}";

export const VEHICLE_BASE64 = {
  bike: BIKE_BASE64,
  auto: AUTO_BASE64,
  car: CAR_BASE64,
  van: VAN_BASE64
};
`;

fs.writeFileSync(path.join(__dirname, 'vehicleBase64.js'), content);
console.log('Successfully generated vehicleBase64.js module!');
