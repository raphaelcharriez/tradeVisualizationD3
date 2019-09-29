const db = require('../config');

const Trade = {}; 

Trade.findAllProducts = () => {
    return db.query(
        `SELECT commodity_code, MIN(commodity) as commodity FROM trade GROUP BY commodity_code`
    );
};

Trade.findAllCountries = () => {
    return db.query(
        `SELECT DISTINCT reporter_iso, reporer FROM trade`
    );
};

Trade.findTopImportsCountry = (reporter, partner) => {
    return db.query(
        `SELECT commodity_code,
        commodity,
        "trade_value_(us$)" as trade_value,
        dependancy,
        total_export_reporter,
        total_import_partner,
        total_trade,
        reporter_iso,
        partner_iso
        FROM trade    
        WHERE trade_flow_code = '1.0'
        AND LOWER(reporter_iso) = LOWER('${reporter}')
        AND LOWER(partner_iso) = LOWER('${partner}')
        ORDER BY "trade_value_(us$)" desc 
        limit 10000 
        `
    );
};

Trade.findTopExportsCountry = (reporter, partner) => {
    return db.query(
        `SELECT commodity_code,
        commodity,
        "trade_value_(us$)" as trade_value,
        dependancy,
        total_export_reporter,
        total_import_partner,
        total_trade,
        reporter_iso,
        partner_iso
        FROM trade    
        WHERE trade_flow_code = '2.0'
        AND LOWER(reporter_iso) = LOWER('${reporter}')
        AND LOWER(partner_iso) = LOWER('${partner}')
        ORDER BY "trade_value_(us$)" desc 
        limit 10000 
        `,
        [reporter, partner]
    );
};

Trade.findTopExportsProduct = (commodities) => {
    return db.query(
        `SELECT DISTINCT A.*, 
            PARTNER.longitude as partner_longitude,
            PARTNER.latitude as partner_latitude,
            REPORTER.longitude as reporter_longitude,
            REPORTER.latitude as reporter_latitude 
        FROM (
            SELECT SUM(CAST("trade_value_(us$)" AS REAL)) as trade_value , reporter_iso, partner_iso 
            FROM trade
            WHERE trade_flow_code = '2.0'
            AND commodity_code = ANY(regexp_split_to_array($1, ','))
            GROUP BY reporter_iso, partner_iso
            ORDER BY "trade_value" desc 
            limit 1000) A 
        LEFT JOIN (
            SELECT longitude, latitude, alpha_3 from locations
        ) REPORTER
        ON A.reporter_iso = REPORTER.alpha_3
        LEFT JOIN (
            SELECT longitude, latitude, alpha_3 from locations
        ) PARTNER
        ON A.partner_iso = PARTNER.alpha_3
        ORDER BY "trade_value" desc 
        `,
        [commodities]
    );
};


Trade.findCountryBalanceProduct = (commodities) => {
    return db.query(
        `
            SELECT 
                SUM(CASE WHEN trade_flow_code = '2.0' THEN CAST("trade_value_(us$)" AS REAL) ELSE 0 END) as export_value,
                SUM(CASE WHEN trade_flow_code = '1.0' THEN CAST("trade_value_(us$)" AS REAL) ELSE 0 END) as import_value,
                reporter_iso
            FROM trade
            WHERE commodity_code = ANY(regexp_split_to_array($1, ','))
            AND partner_iso = 'WLD'
            GROUP BY reporter_iso
            limit 1000
        `,
        [commodities]
    );
};
module.exports = Trade; 


