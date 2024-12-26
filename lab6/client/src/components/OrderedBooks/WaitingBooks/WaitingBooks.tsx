import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { Book, ResponseMessage } from '../../../assets/interfaces/responseInterfaces';
import Rating from '../../../assets/components/Rating/Rating';
import './WaitingBooks.css';
import { getWaitingBooks } from '../../../assets/functions/requestsFunctions';

const WaitingBooks = () => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Book[] | string>('loading');
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async (id: string) => {
    const res: Response = await getWaitingBooks();
    if (res.status >= 400) {
      const message: ResponseMessage = await res.json();
      setError(message.message);
      return;
    }
    const books: Book[] = await res.json();
    setData(books);
  };

  useEffect(() => {
    fetchData(id as string);
  }, []);

  return (
    <div className="waiting_books">
      <p>Waiting For</p>
      <div>
        {data === 'loading' && !error && <p>{data}</p>}
        {data.length == 0 && <p>Oops! You are not waiting for any book </p>}
        {typeof data !== 'string' &&
          data.map((book: Book) => (
            <div key={book._id} onClick={() => navigate(`/book/${book._id}`)}>
              <img src={book.imageUrl} />
              <p>{book.name}</p>
              <Rating book={book} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default WaitingBooks;
