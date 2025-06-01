import { useState } from 'react'
import RecentTransaction from './components/RecentTransaction';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RecentTransaction/>
    </>
  )
}

export default App
