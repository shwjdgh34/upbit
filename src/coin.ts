import axios, { AxiosResponse } from 'axios';
import { Logger } from '@nestjs/common';
import { Mail } from './mail'
import { statusStandard, BIG_NUMBER } from './config';
import { requestRetry } from './request';

enum CoinStatus {
  STABLE = 'STABLE',
  RISING = 'RISING'
}

export class Coin {
  private readonly logger = new Logger(Coin.name)
  private currentPrice: number;
  private name: string;
  private lowestPrice: number;
  private status: CoinStatus;
  private messageFlag: boolean;

  constructor(name: string) {
    this.name = name;
    this.status = CoinStatus.STABLE;
    this.currentPrice = BIG_NUMBER;
    this.messageFlag = false;
  }

  async getCurrentPrice(): Promise<number> {
    try {
      const response: AxiosResponse = await requestRetry(
        {
          url: 'https://api.upbit.com/v1/ticker',
          params: { markets: `KRW-${this.name}` }
        }
      );
      this.currentPrice = response.data[0].trade_price;
    }
    catch (e) {
      this.logger.error(e);
    }
    return this.currentPrice;
  }


  async updateLowestPrice(fourHourCandleNumber: number) {
    try {
      const response: AxiosResponse = await requestRetry(
        {
          url: 'https://api.upbit.com/v1/candles/minutes/240',
          params: {
            market: `KRW-${this.name}`,
            count: fourHourCandleNumber
          }
        }
      );
      response.data.forEach(candle => {
        if (this.lowestPrice > candle.low_price) this.lowestPrice = candle.low_price;
      })
    }
    catch (e) {
      this.logger.error(`updateLoewstPrice ${e}`);
    }

  }

  setLowestPrice(lowestPrice: number) {
    this.lowestPrice = lowestPrice;
  }
  initMessageFlag() {
    this.messageFlag = false;
  }
  async updateStatus() {
    const currentPrice: number = await this.getCurrentPrice();

    // STABLE -> RISING
    if (this.status == CoinStatus.STABLE && this.lowestPrice * statusStandard < currentPrice) {
      //push message
      this.status = CoinStatus.RISING;
      if (!this.messageFlag) {
        Mail.send(this.name, currentPrice, this.lowestPrice);
        this.messageFlag = true;
      }
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

