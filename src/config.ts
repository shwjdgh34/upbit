import * as dotenv from 'dotenv'

dotenv.config();

export const coinList: string[] = ['STRAX', 'EMC2', 'DOT', 'BCH'];
export const statusStandard = 1.2;
export const emailConfigs = {
  senderId: process.env.SENDER_ID,
  senderPw: process.env.SENDER_PW,
  receiverId: process.env.RECEIVER_ID

}