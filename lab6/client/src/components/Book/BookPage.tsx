import React, { useEffect, useState } from 'react';
import { ResponseMessage } from '../../assets/interfaces/responseInterfaces';
import { useParams } from 'react-router-dom';
import { getBook } from '../../assets/functions/requestsFunctions';
import { Book } from '../../assets/interfaces/responseInterfaces';
import Rating from '../../assets/components/Rating/Rating';
import './BookPage.css';
import StatusButton from '../../assets/components/StatusButton/StatusButton';

const BookPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Book | string>('loading');
  const { id } = useParams();

  const fetchData = async (id: string) => {
    const res: Response = await getBook(id as string);
    if (res.status >= 400) {
      const message: ResponseMessage = await res.json();
      setError(message.message);
      return;
    }
    const book: Book = await res.json();
    setData(book);
  };

  useEffect(() => {
    fetchData(id as string);
  }, []);

  return (
    <div className="book_page">
      {data === 'loading' && !error && <p>{data}</p>}
      {error && <p>Such book doesn't exist</p>}
      {typeof data !== 'string' && (
        <div>
          <img src={data.imageUrl} />
          <div>
            <Rating book={data} />
            <h2>{data.name}</h2>
            <span>{data.author}</span>
            <a>
              {data.length} pages,released in {data.released}
            </a>
            <StatusButton id={id} />
            <div className="about_book">
              <p>About book</p>
              <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookPage;
