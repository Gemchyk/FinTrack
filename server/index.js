// server/index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5050;

app.use(cors());
app.use(bodyParser.json());

// Баланс хранится временно в памяти
let balance = 25000;

app.get('/', (req, res) => {
    res.send('🚀 Сервер работает!');
  });

// Получить текущий баланс
app.get('/balance', (req, res) => {
  res.json({ sum: balance });
});

// Добавить к балансу
app.post('/balance/add', (req, res) => {
  const { amount } = req.body;
  if (typeof amount === 'number' && amount > 0) {
    balance += amount;
    res.json({ sum: balance });
  } else {
    res.status(400).json({ error: 'Invalid amount' });
  }
});

// Снять с баланса
app.post('/balance/remove', (req, res) => {
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

