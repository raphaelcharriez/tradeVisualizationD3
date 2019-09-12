import {
    IProduct    
} from "../../Types/index"


export function convertProduct(rawProduct: {commodity_code : string, commodity: string}):  IProduct {
    return {
        "commodityCode": rawProduct.commodity_code,
        "commodity": rawProduct.commodity
    }
} 
