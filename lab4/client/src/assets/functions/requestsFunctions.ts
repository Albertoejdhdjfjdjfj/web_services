import { host } from '../constans/requestsConstants';
import Cookies from 'js-cookie';

export async function signUp(
  username: string,
  birthday: string,
  email: string,
  password: string
): Promise<Response> {
  const message = await fetch(host + '/auth/registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      birthday: birthday,
      email: email,
      password: password
    })
  });

  return message;
}

export async function logIn(username: string, password: string): Promise<Response> {
  const message = await fetch(host + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  return message;
}

export async function getAllBooks(
  sort: string,
  page: number,
  limit: number = 4
): Promise<Response> {
  const message = await fetch(host + '/books?sort=' + sort + '&page=' + page + '&limit=' + limit, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return message;
}

export async function getBook(id: string): Promise<Response> {
  const message = await fetch(host + '/books/id?id=' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return message;
}

export async function getStatusBook(id: string): Promise<Response> {
  const token = Cookies.get('token');
  const message = await fetch(host + '/books/status?id=' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  return message;
}

export async function orderBookById(id: string): Promise<Response> {
  const token = Cookies.get('token');
  const message = await fetch(host + '/books/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      id: id
    })
  });

  return message;
}

export async function returnBookById(id: string): Promise<Response> {
  const token = Cookies.get('token');
  const message = await fetch(host + '/books/return', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      id: id
    })
  });

  return message;
}

export async function getWaitingBooks(): Promise<Response> {
  const token = Cookies.get('token');
  const message = await fetch(host + '/books/waiting', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  return message;
}

export async function getOrderedBooks(): Promise<Response> {
  const token = Cookies.get('token');
  const message = await fetch(host + '/books/order', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  return message;
}

export async function verifyToken(): Promise<Response> {
  const token = Cookies.get('token');
  const message = await fetch(host + '/auth/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  return message;
}
