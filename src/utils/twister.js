import { Twisters } from "twisters";
import Core from "../core/core.js";
import setup from "../../setup.js";

const COLORS = {
  BLACK: "\x1b[90m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  WHITE: "\x1b[37m",
  RESET: "\x1b[0m",
  DIM: "\x1b[37m",
  BOLD: "\x1b[1m",
};

class Twist {
  constructor() {
    this.twisters = new Twisters();
  }

  log(action = "", accountKey = "", accountData = new Core(), status = "") {
    const accountIndex = setup.accounts.indexOf(accountKey);
    const address = accountData.address;

    let statusColor = COLORS.GREEN;
    const balance = accountData.balance ?? 0;
    if (status.toLowerCase().includes("error")) {
      statusColor = COLORS.RED;
    } else if (status.toLowerCase().includes("success")) {
      statusColor = COLORS.GREEN;
    } else if (status.toLowerCase().includes("done")) {
      statusColor = COLORS.GREEN;
    } else {
      statusColor = COLORS.YELLOW;
    }

    const template = `======================== Account ${
      accountIndex + 1
    } =====================
  ┌ Address        ┌ ${address}
                   ├ ${Number(balance / 1e18)} CTC
                              
  ┌ Info           ├ ${action}
  └ Status         └ ${statusColor}${status}${COLORS.RESET}
=========================================================\n\n`;

    this.twisters.put(accountKey, {
      spinner: "dots",
      color: "cyan",
      text: template,
    });
  }

  info(message = "") {
    this.twisters.put(2, {
      spinner: "dots",
      color: "cyan",
      text: `\n==============================================\nInfo : ${message}\n==============================================\n`,
    });
  }

  clearInfo() {
    this.twisters.remove(2);
  }

  clear(key) {
    this.twisters.remove(key);
  }
}

export default new Twist();
