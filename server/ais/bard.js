import { Bard } from 'googlebard';

let cookies = `agjOCHeh2P6_92FHhEeidOS86hJrcQAsfJpJD7BXriuDkU5w0S6yZMs9l2jD5enVwak3oA.`;
let bot = new Bard(cookies);

export async function USEBARD(msg) {
  try {
    console.log(msg.trim())
    let response = await bot.ask(msg);
    return response;
  } catch (err) {
    console.log(err);
  }
}
