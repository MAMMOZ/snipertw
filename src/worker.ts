import consola from "consola";
import { getHashFromTwitter, redeemAngPao } from "./util";
import config from "../config.json";
declare var self: Worker;

const cache: string[] = [];
const tokens: Array<string> = [];
let iToken = 0;
let workerNumber = 0;

const main = async () => {
  try {
    let token = tokens[iToken].split("|");
    const result = await getHashFromTwitter(token[0], token[1]);
    result.forEach((hash) => {
      if (cache.includes(hash)) return;
      consola.info(`THREAD ${workerNumber} => NEW HASH ${hash}`);
      config.phoneNumber.forEach((_) => {
        redeemAngPao(hash, _);
      });
      cache.push(hash);
    });
  } catch (e) {
    if (e === 1) {
      iToken++;
      if (iToken === tokens.length - 1) {
        consola.error(`THREAD ${workerNumber} => RESET TOKEN TO 1`);
        iToken = 0;
      }
      consola.info(
        `THREAD ${workerNumber} => SWITCH TOKEN TO ${iToken + 1} !!`
      );
    }
  }
};
(async () => {
  self.onmessage = (event) => {
    consola.info(`START THREAD ${event.data.workerNumber} GOOD JOB!!`);
    tokens.push(...event.data.tokens);
    workerNumber = event.data.workerNumber;
    setInterval(main, config.loopSecond * 1000);
  };
})();