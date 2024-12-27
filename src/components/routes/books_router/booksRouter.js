const {Router} = require('express');
const BooksController = require('./controller/BooksController');


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

module.exports = router;

