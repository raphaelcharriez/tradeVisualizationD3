export const callProductAPI = async () => {
    const response = await fetch('/api/trades/products');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

export const callTradeAPI = async (commodityCodes: string[]) => {
    const comoBlock = commodityCodes.join(",");
    const response = await fetch('/api/trades/export-products?commodities='.concat(comoBlock));
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

export const  callCountryBalanceAPI = async (commodityCodes: string[]) => {
    const comoBlock = commodityCodes.join(",");
    const response = await fetch('/api/trades/country-balance-products?commodities='.concat(comoBlock));
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };
