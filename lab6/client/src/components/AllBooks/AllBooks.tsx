import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router';
import { CombineState } from '../../assets/interfaces/reduxInterfaces';
import { Book, ResponseMessage } from '../../assets/interfaces/responseInterfaces';
import { getAllBooks } from '../../assets/functions/requestsFunctions';
import Rating from '../../assets/components/Rating/Rating';
import BlackStar from '../../assets/images/BlackStar.svg';
import Star from '../../assets/images/Star.svg';
import './AllBooks.css';

const AllBooks = () => {
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<Book[]>(new Array<Book>());
  const sort = useSelector((state: CombineState) => state.state_components.search);
  const navigate = useNavigate();

  function handlePage(): void {
    setPage((prevPage: number) => prevPage + 1);
  }

  async function getData(sort: string, page: number, limit: number = 4): Promise<void> {
    const res: Response = await getAllBooks(sort, 1, page * limit);
    if (res.status >= 400) {
      const message: ResponseMessage = await res.json();
      setError(message.message);
      return;
    }
    const books: Book[] = await res.json();
    setData(books);
  }

  useEffect(() => {
    getData(sort, page);
  }, [sort, page]);

  return (
    <div className="all_books">
      <h2>All books</h2>
      <div>
        {data.map((book: Book) => (
          <div key={book._id} className="book" onClick={() => navigate(`/book/${book._id}`)}>
            <img src={book.imageUrl} />
            <div>
              <p>{book.name}</p>
              <span>{'by ' + book.author}</span>
              <Rating book={book} />
            </div>
          </div>
        ))}
      </div>
      <p onClick={handlePage}>Show more</p>
    </div>
  );
};

export default AllBooks;
