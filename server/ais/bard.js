
import { Bard } from 'googlebard';
let NID = '';
let SID = '';
let __Secure_1PSID = '';
let __Secure_3PSID = '';
let HSID = '';
let SSID = '';
let APISID = '';
let SAPISID = '';
let __Secure_1PAPISID = '';
let __Secure_3PAPISID = '';
let SIDCC = '';
let __Secure_1PSIDCC = '';
let __Secure_3PSIDCC = '';
let cookies = `__Secure-1PSID=agjOCBKrjgPvZbliTXY4lCVplsB9jXOCCmJQM3JoXrEDoMUZ-_TKq_-hGMVABP5QhKCABQ.`;
let bot = new Bard(cookies);

export async function USEBARD(msg, phone = '') {
  try {
    let response = await bot.ask(msg, phone);

    return response;
  } catch (err) {
    console.log(err, 'vic');
  }
}
