import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, parse } from 'path';
import openDB from '../backend/database.js';


const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/index.html'));
}
);

app.get('/about', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/about.html'));
}
);

app.get('/contact', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/contact.html'));
}
);

app.get('/courses', (req, res) => {
    res.sendFile(join(__dirname, '../frontend/courses.html'));
}
);

app.get('/api', (req, res) => {
    res.send('API is working');
}
);

app.get('/api/users', async (req, res) => {
    try {
        const db = await openDB();
        const users = await db.all('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const db = await openDB();
        const { name, password } = req.body;
        const result = await db.run(
            'INSERT INTO users (name, password) VALUES (?, ?)',
            name,
            password
        );
        res.json({ id: result.lastID, name: name, password: password });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const db = await openDB();
        const { id } = req.params;
        const user = await db.get('SELECT * FROM users WHERE id = ?', id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const db = await openDB();
        const { id } = req.params;
        const { name } = req.body;
        await db.run('UPDATE users SET name = ? WHERE id = ?', name, id);
        res.json({ id, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const db = await openDB();
        const { id } = req.params;
        const result = await db.run('DELETE FROM users WHERE id = ?', id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ 'message': 'User deleted', 'id: ': id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/courses', async (req, res) => {
    try {
        const db = await openDB();
        const courses = await db.all('SELECT * FROM courses');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/courses', async (req, res) => {
    try {
        const db = await openDB();
        const { title, description } = req.body;
        const result = await db.run(
            'INSERT INTO courses (title, description) VALUES (?, ?)',
            title,
            description
        );
        res.json({ id: result.lastID, title: title, description: description });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/courses/:id', async (req, res) => {
    try {
        const db = await openDB();
        const { id } = req.params;
        const course = await db.get('SELECT * FROM courses WHERE id = ?', id);
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/courses/:id', async (req, res) => {
    try {
        const db = await openDB();
        const { id } = req.params;
        const { title, description } = req.body;
        await db.run('UPDATE courses SET title = ?, description = ? WHERE id = ?', title, description, id);
        res.json({ id, title, description });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/courses/:id', async (req, res) => {
    try {
        const db = await openDB();
        const { id } = req.params;
        const result = await db.run('DELETE FROM courses WHERE id = ?', id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ 'message': 'Course deleted', 'id: ': id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

express.static(join(__dirname, '../frontend'));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
