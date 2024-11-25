import React, { useState, useEffect } from 'react';
import { ResponseMessage, Status } from '../../interfaces/responseInterfaces';
import { orderBookById, returnBookById, getStatusBook } from '../../functions/requestsFunctions';
import { useNavigate } from 'react-router';
import './StatusButton.css';

const StatusButton = ({ id }) => {
  const [status, setStatus] = useState<string | null>('Order');
  const navigate = useNavigate();

  async function getStatus(id: string): Promise<void> {
    const res: Response = await getStatusBook(id);

    if (res.status === 400) {
      const message: ResponseMessage = await res.json();
      setStatus(null);
      return;
    }

    const status: Status = await res.json();
    setStatus(status.status);
  }

  async function returnBook(id: string): Promise<void> {
    const res: Response = await returnBookById(id);

    if (res.status === 400) {
      const message: ResponseMessage = await res.json();
      console.log(message);
      return;
    }

    getStatus(id as string);
  }

  async function orderBook(id: string): Promise<void> {
    const res: Response = await orderBookById(id);

    if (res.status === 400) {
      const message: ResponseMessage = await res.json();
      console.log(message);

      return;
    }
    getStatus(id as string);
  }

  useEffect(() => {
    getStatus(id as string);
  }, []);

  return (
    status && (
      <div className="status_button">
        {status === 'Order' && <p onClick={() => orderBook(id)}>{status}</p>}
        {status === 'Available' && <p onClick={() => orderBook(id)}>{status}</p>}
        {status === 'Return' && <p onClick={() => returnBook(id)}>{status}</p>}
        {status === 'Taken' && <p>{status}</p>}
      </div>
    )
  );
};

export default StatusButton;
