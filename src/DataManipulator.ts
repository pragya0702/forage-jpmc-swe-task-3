import { ServerRespond } from './DataStreamer';

export interface Row {
  stock: string,
  top_ask_price: number,
  top_bid_price: number,
  price_abc: number,
  price_def: number,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
  timestamp: Date,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.1;
    const lowerBound = 1 - 0.1;
    return {
      stock: serverRespond[0].stock,
      top_ask_price: serverRespond[0].top_ask.price,
      top_bid_price: serverRespond[0].top_bid.price,
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
      timestamp: serverRespond[0].timestamp,
    };
  }
}