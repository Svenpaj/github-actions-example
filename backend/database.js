import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open a database connection
async function openDB() {
    return open({
        filename: '/backend/database/newtonDB.sqlite',
        driver: sqlite3.Database
    });
}

async function setup() {
    const db = await openDB();
    await db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        password TEXT NOT NULL
    )`);
    await db.exec(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL
    )`);

    console.log('Connected to the SQLite database.');
}

setup();

export default openDB;