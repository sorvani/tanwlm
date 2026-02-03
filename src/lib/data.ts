import fs from 'fs/promises';
import path from 'path';
import { GameData } from './types';

// Path to data.json relative to the project root (process.cwd())
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_PATH = path.join(DATA_DIR, 'data.json');


export async function getGameData(): Promise<GameData> {
    try {
        const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
        return JSON.parse(fileContent) as GameData;
    } catch (error) {
        console.error('Error reading game data:', error);
        // Return empty fallback structure if file is missing or invalid
        return { roster: [], skills: [], races: [] };
    }
}

export async function saveGameData(data: GameData): Promise<boolean> {
    try {
        await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing game data:', error);
        return false;
    }
}
