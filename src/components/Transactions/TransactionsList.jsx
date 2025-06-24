import React from 'react';
import "./Transactions.scss";
import Transaction from "./Transaction";


const transactions = [
    {
      image: "/images/gamepage.svg",
      alt: "Joystick",
      title: "GTR 5",
      subtitle: "Gadget & Gear",
      price: "$160.00",
      date: "17 May 2023",
    },
    {
      image: "/images/bag.svg",
      alt: "Bag",
      title: "Polo Shirt",
      subtitle: "XL fashions",
      price: "$20.00",
      date: "17 May 2023",
    },
    {
      image: "/images/house.svg",
      alt: "House",
      title: "Biriyani",
      subtitle: "Hajir Biriyani",
      price: "$10.00",
      date: "17 May 2023",
    },
    {
      image: "/images/taxi.svg",
      alt: "Taxi",
      title: "Taxi Fare",
      subtitle: "Uber",
      price: "$12.00",
      date: "17 May 2023",
    },
    {
      image: "/images/bag2.svg",
      alt: "Bag2",
      title: "Keyboard",
      subtitle: "Gadget & Gear",
      price: "$22.00",
      date: "17 May 2023",
    },
  ];


const TransactionsList = () => {
    
    
      return (
        <div className="container">
          <main>
            {transactions.map((tx, index) => (
              <Transaction key={index} {...tx} />
            ))}
          </main>
        </div>
      );
};

export default TransactionsList;