import React from 'react';
import { Route, Routes } from 'react-router';
import SignUp from './components/SignUp/SignUp';
import LogIn from './components/LogIn/LogIn';
import Header from './components/Header/Header';
import AllBooks from './components/AllBooks/AllBooks';
import BookPage from './components/Book/BookPage';
import OrderedBooks from './components/OrderedBooks/OrderedBooks';
import Profile from './components/Profile/Profile';
import Verify from './components/Check/Verify';


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<AllBooks />} />
        <Route path="/log_in" element={<LogIn />} />
        <Route path="/log_in/verify" element={<Verify />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/orders" element={<OrderedBooks />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
