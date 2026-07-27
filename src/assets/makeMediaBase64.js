import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rideBanner = fs.readFileSync(path.join(__dirname, 'ride_banner.png')).toString('base64');
const parcelBanner = fs.readFileSync(path.join(__dirname, 'parcel_banner.png')).toString('base64');
const travelBanner = fs.readFileSync(path.join(__dirname, 'travel_banner.png')).toString('base64');
const driverAvatar = fs.readFileSync(path.join(__dirname, 'driver_avatar.png')).toString('base64');
const busImg = fs.readFileSync(path.join(__dirname, 'bus.png')).toString('base64');
const parcelImg = fs.readFileSync(path.join(__dirname, 'parcel.png')).toString('base64');

const content = `export const RIDE_BANNER_BASE64 = "data:image/png;base64,${rideBanner}";
export const PARCEL_BANNER_BASE64 = "data:image/png;base64,${parcelBanner}";
export const TRAVEL_BANNER_BASE64 = "data:image/png;base64,${travelBanner}";
export const DRIVER_AVATAR_BASE64 = "data:image/png;base64,${driverAvatar}";
export const BUS_IMG_BASE64 = "data:image/png;base64,${busImg}";
export const PARCEL_IMG_BASE64 = "data:image/png;base64,${parcelImg}";
`;

fs.writeFileSync(path.join(__dirname, 'mediaBase64.js'), content);
console.log('Successfully generated mediaBase64.js!');
