import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../src/.env') });

export const BIG_NUMBER = 987654321;
export const coinList: string[] = ['STRAX', 'EMC2', 'STEEM', 'MED', 'CBK', 'BCH'];
export const statusStandard = 1.2;
export const emailConfigs = {
  senderId: process.env.SENDER_ID,
  senderPw: process.env.SENDER_PW,
  receiverId: process.env.RECEIVER_ID

}