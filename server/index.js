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

const STANDARD_CATEGORIES = ['Food', 'Health', 'Transport', 'Shopping', 'Fun', 'Other'];

let transactions = [
  {
    id: "1",
    image: "/src/assets/icons/IconShopping.svg?react",
    alt: "Shopping",
    title: "GTR 5",
    amount: 160.0,
    date: "2024-01-15",
    type: "Expense",
    category: "Shopping",
  },
  {
    id: "2",
    image: "/src/assets/icons/IconFood.svg?react",
    alt: "Food",
    title: "Biriyani",
    amount: 10.0,
    date: "2024-02-10",
    type: "Expense",
    category: "Food",
  },
  {
    id: "3",
    image: "/src/assets/icons/IconEntertainment.svg?react",
    alt: "Fun",
    title: "Steam",
    amount: 25.0,
    date: "2024-03-05",
    type: "Expense",
    category: "Fun",
  },
  {
    id: "4",
    image: "/src/assets/icons/IconTransportation.svg?react",
    alt: "Transport",
    title: "Taxi",
    amount: 40.0,
    date: "2024-04-22",
    type: "Expense",
    category: "Transport",
  },
  {
    id: "5",
    image: "/src/assets/icons/IconOthers.svg?react",
    alt: "Other",
    title: "Gift",
    amount: 50.0,
    date: "2024-05-13",
    type: "Expense",
    category: "Other",
  },
  {
    id: "6",
    image: "/src/assets/icons/IconShopping.svg?react",
    alt: "Shopping",
    title: "H&M Clothes",
    amount: 89.99,
    date: "2024-06-29",
    type: "Expense",
    category: "Shopping",
  },
  {
    id: "7",
    image: "/src/assets/icons/IconEntertainment.svg?react",
    alt: "Fun",
    title: "Netflix",
    amount: 12.99,
    date: "2024-07-01",
    type: "Expense",
    category: "Fun",
  },
  {
    id: "8",
    image: "/src/assets/icons/IconFood.svg?react",
    alt: "Food",
    title: "McDonald's",
    amount: 15.5,
    date: "2024-08-20",
    type: "Expense",
    category: "Food",
  },
  {
    id: "9",
    image: "/src/assets/icons/IconTransportation.svg?react",
    alt: "Transport",
    title: "Bus Pass",
    amount: 20.0,
    date: "2024-09-10",
    type: "Expense",
    category: "Transport",
  },
  {
    id: "10",
    image: "/src/assets/icons/IconOthers.svg?react",
    alt: "Other",
    title: "Medicine",
    amount: 33.0,
    date: "2024-10-08",
    type: "Expense",
    category: "Other",
  },
  {
    id: "11",
    image: "/src/assets/icons/IconEntertainment.svg?react",
    alt: "Fun",
    title: "Concert Ticket",
    amount: 70.0,
    date: "2024-11-01",
    type: "Expense",
    category: "Fun",
  },
  {
    id: "12",
    image: "/src/assets/icons/IconShopping.svg?react",
    alt: "Shopping",
    title: "Shoes",
    amount: 120.0,
    date: "2024-12-25",
    type: "Expense",
    category: "Shopping",
  },
  // Новые транзакции
  {
    id: "13",
    image: "/src/assets/icons/IconFood.svg?react",
    alt: "Food",
    title: "Coffee",
    amount: 5.0,
    date: "2024-01-20",
    type: "Expense",
    category: "Food",
  },
  {
    id: "14",
    image: "/src/assets/icons/IconTransportation.svg?react",
    alt: "Transport",
    title: "Subway Ticket",
    amount: 2.75,
    date: "2024-03-15",
    type: "Expense",
    category: "Transport",
  },
  {
    id: "15",
    image: "/src/assets/icons/IconOthers.svg?react",
    alt: "Other",
    title: "Donation",
    amount: 30.0,
    date: "2024-07-10",
    type: "Expense",
    category: "Other",
  },
  {
    id: "16",
    image: "/src/assets/icons/IconEntertainment.svg?react",
    alt: "Fun",
    title: "Movie Ticket",
    amount: 12.0,
    date: "2024-10-22",
    type: "Expense",
    category: "Fun",
  }
];




function calculateMonthlyTotals(transactions) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1).padStart(2, '0'),
    day: new Date(2000, i, 1).toLocaleString('en-US', { month: 'short' }),
    thisWeek: 0
  }));

  for (const tx of transactions) {
    if (tx.type === 'Expense') {
      const monthIndex = new Date(tx.date).getMonth(); // 0-11
      months[monthIndex].thisWeek += tx.amount;
    }
  }

  return months;
}




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
    res.send('Сервер работает!');
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
  
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
  
  if (transaction.type === 'Expense') {
    balance += transaction.amount;
  } else if (transaction.type === 'Income') {
    balance -= transaction.amount;
  }

  transactions = transactions.filter(t => t.id !== id);
  
  res.json({ success: true, balance });
});

// Редактировать транзакцию
app.put('/transactions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const oldTransaction = transactions.find(t => t.id === id);
  if (!oldTransaction) return res.status(404).json({ error: 'Transaction not found' });

  if (oldTransaction.type === 'Expense') {
    balance += oldTransaction.amount;      
    balance -= updatedData.amount;        
  } else if (oldTransaction.type === 'Income') {
    balance -= oldTransaction.amount;
    balance += updatedData.amount;
  }
  transactions = transactions.map(t =>
    t.id === id ? { ...t, ...updatedData } : t
  );

  res.json({ success: true, balance });
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

app.get('/transactions/filtered', authenticateToken, (req, res) => {
  const { page = 1, limit = 5, type = 'all', category = 'all' } = req.query;

  let filtered = [...transactions];

  if (type !== 'all') {
    filtered = filtered.filter(tx => tx.type === type);
  }

  if (category !== 'all') {
    if (category === 'Other') {
      filtered = filtered.filter(tx => !STANDARD_CATEGORIES.includes(tx.category) || tx.category === 'Other');
    } else {
      filtered = filtered.filter(tx => tx.category === category);
    }
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginated = filtered.slice(start, end);

  res.json({
    data: paginated,
    hasMore: end < total
  });
});




app.get('/dashboard', authenticateToken, (req, res) => {
  const dashboardData = calculateMonthlyTotals(transactions);
  res.json({ data: dashboardData });
});