import React from 'react';
import WaitingBooks from './WaitingBooks/WaitingBooks';
import ListBooks from './ListBooks/ListBooks';
import './OrderedBooks.css';

const OrderedBooks = () => {
  return (
    <div className="ordered_books">
      <WaitingBooks />
      <ListBooks />
    </div>
  );
};

export default OrderedBooks;
