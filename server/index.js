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

let balance = 25000;


// Мок пользователь
const users = [
  {
    username: 'admin',
    password: '$2b$10$S9k5THchbjn7a.YbQzpkvuWe8HVb055x/qqlrBNkh5.sApymc6ScO' // пароль: "admin"
  }
];
let transactions = [
  {
    id: "1",
    image: "/src/assets/icons/IconShopping.svg?react",
    alt: "Joystick",
    title: "GTR 5",
    amount: 160.0,
    date: "2023-11-17",
    type: "Expense",
    category: "Shopping",
  },
  {
    id: "2",
    image: "/src/assets/icons/IconFood.svg?react",
    alt: "House",
    title: "Biriyani",
    amount: 10.0,
    date: "2023-09-17",
    type: "Expense",
    category: "Food",
  },
];


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; 

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; 
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






// Получить все транзакции
app.get('/transactions', authenticateToken, (req, res) => {
  res.json(transactions);
});

// Добавить транзакцию
app.post('/transactions', authenticateToken, (req, res) => {
  const transaction = req.body;
  if (!transaction.id) {
    return res.status(400).json({ error: 'Missing transaction ID' });
  }
  transactions.unshift(transaction);
  res.json({ success: true });
});

// Удалить транзакцию
app.delete('/transactions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  transactions = transactions.filter(t => t.id !== id);
  res.json({ success: true });
});

// Редактировать транзакцию
app.put('/transactions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  transactions = transactions.map(t =>
    t.id === id ? { ...t, ...updatedData } : t
  );
  res.json({ success: true });
});

// Фильтрация
app.get('/transactions/sortBy/:criteria', authenticateToken, (req, res) => {
  const { criteria } = req.params;
  let sorted = [...transactions];

  if (criteria === 'date') {
    sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (criteria === 'amount') {
    sorted.sort((a, b) => a.amount - b.amount);
  } else if (criteria === 'name') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  res.json(sorted);
});



app.get('/transactions/paginated', authenticateToken, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = transactions.slice(start, end)
  const hasMore = end < transactions.length;

  res.json({ data: paginated, hasMore });
});

