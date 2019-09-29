const Trade = require('../models/trade');

const tradeController = {};

tradeController.findAllProducts = (req, res) => {
    Trade.findAllProducts()
    .then( products => {
        res.json({
            message: 'Success', 
            data : products
        });
    })
    .catch(
        err => {
            console.log(err);
            res.status(500).json({err});
        }
    );
};

tradeController.findAllCountries = (req, res) => {
    Trade.findAllCountries()
    .then( products => {
        res.json({
            message: 'Success', 
            data : products
        });
    })
    .catch(
        err => {
            console.log(err);
            res.status(500).json({err});
        }
    );
};

tradeController.findTopImportsCountry = (req, res) => {
    const reporter = req.query.reporter
    const partner = req.query.partner
    Trade.findTopImportsCountry(reporter, partner)
    .then( products => {
        res.json({
            message: 'Success', 
            data : products
        });
    })
    .catch(
        err => {
            console.log(err);
            res.status(500).json({err});
        }
    );
};

tradeController.findTopExportsCountry = (req, res) => {
    const reporter = req.query.reporter
    const partner = req.query.partner
    Trade.findTopExportsCountry(reporter, partner)
    .then( products => {
        res.json({
            message: 'Success', 
            data : products
        });
    })
    .catch(
        err => {
            console.log(err);
            res.status(500).json({err});
        }
    );
};

tradeController.findTopExportsProduct = (req, res) => {
    const commodities = req.query.commodities
    Trade.findTopExportsProduct(commodities)
    .then( products => {
        res.json({
            message: 'Success', 
            data : products
        });
    })
    .catch(
        err => {
            console.log(err);
            res.status(500).json({err});
        }
    );
};

tradeController.findCountryBalanceProduct = (req, res) => {
    const commodities = req.query.commodities
    Trade.findCountryBalanceProduct(commodities)
    .then( products => {
        res.json({
            message: 'Success', 
            data : products
        });
    })
    .catch(
        err => {
            console.log(err);
            res.status(500).json({err});
        }
    );
};

module.exports = tradeController; 