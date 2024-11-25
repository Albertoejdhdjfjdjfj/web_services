import { Request, Response } from 'express';
import {ObjectId}from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { BookModel, Book } from '../models/Book';
import { OrderedBookModel } from '../models/OrderedBook';
import { UserBookListsModel, UserBookLists, UserBook } from '../models/UserBookLists';

export default class BooksController {
  async getBooks(req: Request, res: Response): Promise<void> {
    try {
      const { sort, page, limit } = req.query;
      const pageNumber = page ? parseInt(page as string) : 1;
      const limitNumber = parseInt(limit as string);
      const skip = (pageNumber - 1) * limitNumber;
      const regex = new RegExp(sort as string, 'i');
      const books = await BookModel.find({
        $or: [
          { name: { $regex: regex } },
          { author: { $regex: regex } },
          { description: { $regex: regex } },
        ],
      })
        .skip(skip)
        .limit(limitNumber);
      res.status(200).json(books);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка при получении книг' });
    }
  }

  async setBooks(req: Request, res: Response): Promise<void> {
    try {
      const booksArray: Array<Book> = req.body;
      const insertedBooks = await BookModel.insertMany(booksArray);
      res.status(200).json(insertedBooks);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка при сохранении' });
    }
  }

  async getBookById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const book = await BookModel.findOne({_id:id});
      res.status(200).json(book);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка при получении книги' });
    }
  }

  async orderBook(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const {id } = req.body;
    

      if (!token) {
        res.status(403).json({ message: 'Пользователь не авторизован' });
        return; 
      }

      let userId: string;
      try {
        const decodedToken: any = jwt.verify(token, config.secret);
        userId = decodedToken.userId;
      } catch (error) {
        res.status(401).json({ message: 'Неверный токен авторизации' });
        return;
      }

      const book = await BookModel.findOne({_id:id });
      if (!book) {
        res.status(400).json({ message: 'Такой книги не существует' });
        return;
      }

      await OrderedBookModel.findOneAndUpdate(
        { bookId: id },
        { $push: { usersIds: userId } },
        { upsert: true, new: true }
      );
      


      res.status(200).json({ message: 'Успешно заказано' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка при заказе книги' });
    }
  }

  async returnBook(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const { id } = req.body;
  
      if (!token) {
        res.status(403).json({ message: 'Пользователь не авторизован' });
        return;
      }
  
      let userId: string;
      try {
        const decodedToken: any = jwt.verify(token, config.secret);
        userId = decodedToken.userId;
      } catch (error) {
        res.status(401).json({ message: 'Неверный токен авторизации' });
        return;
      }
  
      const book = await OrderedBookModel.findOne({ bookId: id });
      if (!book) {
        res.status(400).json({ message: 'Такой книги не существует' });
        return;
      }
  
      await OrderedBookModel.findOneAndUpdate(
        { bookId: id },
        { $pop: { usersIds: -1 } },
        { upsert: true, new: true }
      );
  
      const userBookList = await UserBookListsModel.findOne({ userId: userId });
      if (userBookList && userBookList.books.some((b) => b.bookId === id)) {
        res.status(200).json({ message: 'Книга уже присутствует в списке пользователя' });
        return;
      }
  
      await UserBookListsModel.findOneAndUpdate(
        { userId: userId },
        { $push: { books: { $each: [{ bookId: id, rating: 0 }], $position: 0 } } },
        { upsert: true, new: true }
      );
  
      res.status(200).json({ message: 'Книга успешно возвращена' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка при возврате книги' });
    }
  }

  async getSatusBook(req: Request, res: Response): Promise<void> {
    try { 
      const token = req.headers.authorization?.split(' ')[1];
      const { id } = req.query; 
  
      if (!token) {
        res.status(403).json({ message: 'Пользователь не авторизован' });
        return;
      }
     
      let userId:string;
      try {
        const decodedToken: any = jwt.verify(token as string, config.secret);
        userId = decodedToken.userId;
      } catch (error) {
        res.status(401).json({ message: 'Неверный токен авторизации' });
        return;
      }
  
      const orderedBook=await OrderedBookModel.findOne({bookId:id});
            const book=await BookModel.findOne({_id:id });
      if(!book){
        res.status(400).json({ message: 'Ошибка при получении статуса книги' });
        return;
      }
      
      if(!orderedBook||orderedBook.usersIds.length==0){
        res.status(200).json({status:'Available'});
        return;
      }
      else if(orderedBook.usersIds.indexOf(userId)==0){
        res.status(200).json({status:'Return'});
        return;
      }
    
      res.status(200).json({status:'Taken'});
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка при заказе книги' });
    }
  }

  async setRatingBook(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const{id}=req.query
    const { rating } = req.body;

    if (!token) {
      res.status(403).json({ message: 'Пользователь не авторизован' });
      return;
    }

    let userId: string;
    try {
      const decodedToken: any = jwt.verify(token, config.secret);
      userId = decodedToken.userId;
    } catch (error) {
      res.status(401).json({ message: 'Неверный токен авторизации' });
      return;
    }

    const userBookList = await UserBookListsModel.findOne({ userId: userId });
    if (!userBookList) {
      res.status(400).json({ message: 'Нельзя оценить книгу' });
      return;
    }

    const index = userBookList.books.findIndex((book: UserBook) => book.bookId === id);
    if (index === -1) {
      res.status(400).json({ message: 'Нельзя оценить книгу' });
      return;
    }

    userBookList.books[index].rating = rating;
    await userBookList.save();

    res.status(200).json();
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Ошибка при оценке книги' });
  }
}
async getWaitingBooks(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(403).json({ message: 'Пользователь не авторизован' });
      return;
    }

    let userId: string;
    try {
      const decodedToken: any = jwt.verify(token as string, config.secret);
      userId = decodedToken.userId;
    } catch (error) {
      res.status(401).json({ message: 'Неверный токен авторизации' });
      return;
    }

    const orderedBooks = await OrderedBookModel.aggregate([
      {
        $match: {
          usersIds: {
            $elemMatch: {
              $eq: userId
            }
          }
        }
      },
      {
        $project: {
          usersIds: 1,
          bookId: 1
        }
      }
    ]);

    if (orderedBooks.length === 0) {
      res.status(200).json([]);
      return;
    }

    const waitingBookIds = orderedBooks
      .filter((orderedBook) => orderedBook.usersIds.indexOf(userId) !== 0)
      .map((orderedBook) => orderedBook.bookId);

    const books = await BookModel.find({ _id: { $in: waitingBookIds } });

    res.status(200).json(books);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Ошибка при получении ожидаемых книг' });
  }
}

async getOrderedBooks(req: Request, res: Response):Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(403).json({ message: 'Пользователь не авторизован' });
      return;
    }

    let userId: string;
try {
  const decodedToken: any = jwt.verify(token as string, config.secret);
  userId = decodedToken.userId;
} catch (error) {
  res.status(401).json({ message: 'Неверный токен авторизации' });
  return;
}

    const list = await UserBookListsModel.findOne({ userId });

    if (!list) {
      res.status(200).json([]);
      return;
    }

    const bookIds = list.books.map((book) => book.bookId);

    const books = await BookModel.find({ _id: { $in: bookIds } });

    // Обновление рейтинга для каждой книги из списка
    const orderedBooks = books.map((book) => {
      const bookRating = list.books.find((item) => item.bookId === book._id.toString());
      return {
        ...book.toObject(),
        rating: bookRating ? bookRating.rating : 0,
      };
    });

    res.status(200).json(orderedBooks);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Ошибка при заказе книги' });
  }
}
}

