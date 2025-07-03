// server/index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 5050;

app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'FinTrack'

// Мок пользователь
const users = [
  {
    username: 'admin',
    password: '$2b$10$S9k5THchbjn7a.YbQzpkvuWe8HVb055x/qqlrBNkh5.sApymc6ScO' // пароль: "admin"
  }
];


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // сохранили расшифрованного пользователя
    next();
  });
}


// Авторизация
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Wrong password' });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '10m' });
  res.json({ token });
});

// Баланс хранится временно в памяти
let balance = 25000;

app.get('/', (req, res) => {
    res.send('🚀 Сервер работает!');
  });

// Получить текущий баланс
app.get('/balance', authenticateToken, (req, res) => {
  res.json({ sum: balance });
});


// Добавить к балансу
app.post('/balance/add', authenticateToken, (req, res) => {
  const { amount } = req.body;
  if (typeof amount === 'number' && amount > 0) {
    balance += amount;
    res.json({ sum: balance });
  } else {
    res.status(400).json({ error: 'Invalid amount' });
  }
});

app.post('/balance/remove', authenticateToken, (req, res) => {
  const { amount } = req.body;
  if (typeof amount === 'number' && amount > 0) {
    if (amount <= balance) {
      balance -= amount;
      res.json({ sum: balance });
    } else {
      res.status(400).json({ error: 'Insufficient funds' });
    }
  } else {
    res.status(400).json({ error: 'Invalid amount' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

