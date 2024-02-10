import { getHashFromTwitter, redeemAngPao, sleep } from "./util";
import consola from "consola";
import config from "../config.json";

// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================
// Please run with bun using the following command: `bun ./src/index.ts`
// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================
const tokens: Array<string> = (await Bun.file("./token.txt").text()).split(
  "\n"
);
const workerList: Worker[] = [];
(async () => {
  consola.info("START BOT SNIPER TRUEWALLET");
  consola.info(
    `HAVE ${tokens.length} TOKEN AND COOKIE LOOP ${config.loopSecond} SEC`
  );
  for (let i in Array.from({ length: config.thread })) {
    const workerURL = new URL("worker.ts", import.meta.url).href;
    const _ = new Worker(workerURL);
    workerList.push(_);
  }
  for (let i in workerList) {
    await sleep(300);
    workerList[i].postMessage({ workerNumber: Number(i) + 1, tokens: tokens });
  }
})();