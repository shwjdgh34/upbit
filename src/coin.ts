import axios, { AxiosResponse } from 'axios';
import { Logger } from '@nestjs/common';
import { Mail } from './mail'
import { statusStandard } from './config';

enum CoinStatus {
  STABLE = 'STABLE',
  RISING = 'RISING'
}

export class Coin {
  private readonly logger = new Logger(Coin.name)
  private name: string;
  private lowestPrice: number;
  private status: CoinStatus;

  constructor(name: string) {
    this.name = name;
    this.status = CoinStatus.STABLE
  }

  async getCurrentPrice(): Promise<number> {
    const response: AxiosResponse = await axios.get('https://api.upbit.com/v1/ticker', { params: { markets: `KRW-${this.name}` } });
    return response.data[0].trade_price;
  }


  async updateLowestPrice(fourHourCandleNumber: number) {
    const response: AxiosResponse = await axios.get('https://api.upbit.com/v1/candles/minutes/240', {
      params: {
        market: `KRW-${this.name}`,
        count: fourHourCandleNumber
      }
    });
    response.data.forEach(candle => {
      if (this.lowestPrice > candle.low_price) this.lowestPrice = candle.low_price;
    })
  }

  setLowestPrice(lowestPrice: number) {
    this.lowestPrice = lowestPrice;
  }

  async updateStatus() {


    const currentPrice: number = await this.getCurrentPrice();


    // STABLE -> RISING
    if (this.status == CoinStatus.STABLE && this.lowestPrice * statusStandard < currentPrice) {
      //push message
      this.status = CoinStatus.RISING;
      Mail.send(this.name, currentPrice, this.lowestPrice);

    }

    // RISING -> STABLE
    else if (this.status == CoinStatus.RISING && this.lowestPrice * statusStandard > currentPrice) {
      this.logger.log(`${this.name} get Stable!`);
      this.status = CoinStatus.STABLE;
    }
  }

  getName(): string {
    return this.name;
  }
}

