import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Coin } from './coin';
import { coinList } from './config';
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private coins: Coin[] = [];

  constructor() {
    this.init();
  }

  init() {
    // Create Coin linstance list
    coinList.forEach(coin => {
      this.coins.push(new Coin(coin));
      this.logger.log(`created Coin class :: ${coin}`);
    })

    // init lowest price
    this.coins.forEach(async c => {
      const currentPrice: number = await c.getCurrentPrice();
      c.setLowestPrice(currentPrice);
      c.updateLowestPrice(3);
    });


  }
  @Cron('* * */4 * * *')
  updateCandleData() {
    this.coins.forEach(async c => {
      c.initMessageFlag();
      c.updateLowestPrice(3)
    });
  }


  @Cron('*/10 * * * * *')
  updateCoinStatus() {
    this.coins.forEach(async c => {
      c.updateStatus()
    });
  }

}
