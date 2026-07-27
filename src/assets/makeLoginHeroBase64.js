import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buf = fs.readFileSync(path.join(__dirname, 'login_hero.png'));
const base64 = buf.toString('base64');
const content = `export const LOGIN_HERO_BASE64 = "data:image/png;base64,${base64}";\n`;

fs.writeFileSync(path.join(__dirname, 'loginHeroBase64.js'), content);
console.log('Successfully created loginHeroBase64.js!');
