import { USEBARD } from '../ais/bard';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const dt = await USEBARD(body.document);
    return { results: dt };
  } catch (err) {
    console.log(err);
    return err;
  }
});
