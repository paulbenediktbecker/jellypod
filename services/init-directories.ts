import path from 'path';
import fs from 'fs';
import {execSync} from 'child_process';



export const dataDir = path.join(process.cwd(), 'data');
export const artworkDir = path.join(dataDir, 'artwork');



const SMB_USER = process.env.SMB_USER || 'guest';
const SMB_PASSWORD = process.env.SMB_PASSWORD || '';

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

if (!fs.existsSync(artworkDir)) {
  fs.mkdirSync(artworkDir);
}

