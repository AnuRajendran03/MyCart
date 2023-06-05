var express = require('express');
var router = express.Router();

var {
    getadminlogin,
    login,
    addProductpage,
    addProduct
} = require('../controllers/adminControllers')

/* GET users listing. */
router.get('/', getadminlogin);
router.post('/Login',login)
router.get('/addProduct',addProductpage);
router.post('/addItem',addProduct);

module.exports = router;
