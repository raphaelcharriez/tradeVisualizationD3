import {
    IProduct,
} from "../../Types/index";

export function convertProduct(rawProduct: {commodity_code: string, commodity: string}): IProduct {
    return {
        commodity: rawProduct.commodity,
        commodityCode: rawProduct.commodity_code,
    };
}
