import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, parse } from 'path';
import openDB from '../backend/database.js';


const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Newton!');
}
);

app.get('/api/users', async (req, res) => {
    const db = await openDB();
    const users = await db.all('SELECT * FROM users');
    res.json(users);
});

app.post('/api/users', async (req, res) => {
    const db = await openDB();
    const { name, password } = req.body;
    const result = await db.run(
        'INSERT INTO users (name, password) VALUES (?, ?)',
        name,
        password
    );
    res.json({ id: result.lastID, name: name, password: password });
});

app.get('/api/users/:id', async (req, res) => {
    const db = await openDB();
    const { id } = req.params;
    const user = await db.get('SELECT * FROM users WHERE id = ?', id);
    res.json(user);
});

app.put('/api/users/:id', async (req, res) => {
    const db = await openDB();
    const { id } = req.params;
    const { name, password } = req.body;
    await db.run('UPDATE users SET name = ?, password = ? WHERE id = ?', name, password, id);
    res.json({ id, name, password });
});

app.delete('/api/users/:id', async (req, res) => {
    const db = await openDB();
    const { id } = req.params;
    await db.run('DELETE FROM users WHERE id = ?', id);
    res.json({ 'message': 'User deleted', 'id: ': id });
});

app.get('/api/courses', async (req, res) => {
    const db = await openDB();
    const courses = await db.all('SELECT * FROM courses');
    res.json(courses);
});

app.post('/api/courses', async (req, res) => {
    const db = await openDB();
    const { title, description } = req.body;
    const result = await db.run(
        'INSERT INTO courses (title, description) VALUES (?, ?)',
        title,
        description
    );
    res.json({ id: result.lastID, title: title, description: description });
});

app.get('/api/courses/:id', async (req, res) => {
    const db = await openDB();
    const { id } = req.params;
    const course = await db.get('SELECT * FROM courses WHERE id = ?', id);
    res.json(course);
});

app.put('/api/courses/:id', async (req, res) => {
    const db = await openDB();
    const { id } = req.params;
    const { title, description } = req.body;
    await db.run('UPDATE courses SET title = ?, description = ? WHERE id = ?', title, description, id);
    res.json({ id, title, description });
});

app.delete('/api/courses/:id', async (req, res) => {
    const db = await openDB();
    const { id } = req.params;
    await db.run('DELETE FROM courses WHERE id = ?', id);
    res.json({ id });
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
