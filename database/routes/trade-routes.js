const express = require('express');

const tradeRouter = express.Router();

const tradeController = require('../controllers/trade-controllers');

tradeRouter.get('/products', tradeController.findAllProducts);
tradeRouter.get('/countries', tradeController.findAllCountries);
tradeRouter.get('/imports-country', tradeController.findTopImportsCountry);
tradeRouter.get('/exports-country', tradeController.findTopExportsCountry);
tradeRouter.get('/export-products', tradeController.findTopExportsProduct);
tradeRouter.get('/country-balance-products', tradeController.findCountryBalanceProduct);

module.exports = tradeRouter; 