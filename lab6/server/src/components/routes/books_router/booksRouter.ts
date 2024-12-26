import {Router} from 'express';
import BooksController from './controller/BooksController';


const router= Router();
const controller = new BooksController;
router.get('/',controller.getBooks);
router.get('/id',controller.getBookById);
router.post('/order',controller.orderBook);
router.get('/order',controller.getOrderedBooks);
router.post('/return',controller.returnBook);
router.get('/status',controller.getSatusBook);
router.post('/rating',controller.setRatingBook);
router.get('/waiting',controller.getWaitingBooks);

export default router;

