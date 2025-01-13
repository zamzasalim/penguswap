import Twist from "./twister.js";
import bip39 from "bip39";
import moment from "moment-timezone";
import { ethers } from "ethers";
import setup from "../../setup.js";

export class Helper {
  static animation = [
    "🕛",
    "🕐",
    "🕑",
    "🕒",
    "🕓",
    "🕔",
    "🕕",
    "🕖",
    "🕗",
    "🕘",
    "🕙",
  ];

  static delay(
    ms,
    accountKey = "",
    accountData = {},
    action = "",
    status = ""
  ) {
    return new Promise((resolve) => {
      let loading;
      const spinnerChars = this.animation;
      let spinnerIndex = 0;
      let elapsedTime = 0;

      if (accountKey) {
        Twist.log(action, accountKey, accountData, status);
      }

      loading = setInterval(() => {
        const seconds = Math.floor(elapsedTime % 60);
        Twist.log(
          action,
          accountKey,
          accountData,
          `${spinnerChars[spinnerIndex]} ${seconds}s ${status}...`
        );
        spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
        elapsedTime++;
      }, 1000);

      setTimeout(() => {
        clearInterval(loading);
        resolve();
      }, ms);
    });
  }

  static logTransactionError(error, action, accountKey = "", accountData = {}) {
    const errorMessage =
      error.reason || error.message || "Transaction reverted without reason.";
    const timestamp = this.getCurrentTimestamp();
    const logMessage = `Transaction failed during action: ${action} - Error: ${errorMessage} at ${timestamp}`;
    Twist.log(action, accountKey, accountData, logMessage, "");
    if (accountKey) {
      const formattedMessage = `Error during action: ${action} Message: ${errorMessage} Timestamp: ${timestamp}`;
      Twist.log(action, accountKey, accountData, formattedMessage, "");
    }
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomFloat(min, max, decimals = 4) {
    const minValue = parseFloat(min);
    const maxValue = parseFloat(max);
    return (Math.random() * (maxValue - minValue) + minValue).toFixed(decimals);
  }

  static getCurrentTimestamp(timezone = "Asia/Singapore") {
    return moment().tz(timezone).unix().toString();
  }

  static msToTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.round((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  static serializeBigInt(obj) {
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }

  static validateInput(input) {
    const isValidMnemonic = bip39.validateMnemonic(input);
    if (isValidMnemonic) return "Secret Phrase";

    const isValidPrivateKey = /^(0x)?[a-fA-F0-9]{64}$/.test(input);
    return isValidPrivateKey ? "Private Key" : "Unknown";
  }

  static isToday(date) {
    const today = new Date();
    const compareDate = new Date(date);
    return today.toDateString() === compareDate.toDateString();
  }

  static validateAddress(address) {
    if (!ethers.isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }
    return address;
  }

  static showSkelLogo() {
    console.log(`
      █████████   █████ ███████████   ██████████   ███████████      ███████    ███████████       █████████    █████████    █████████
     ███░░░░░███ ░░███ ░░███░░░░░███ ░░███░░░░███ ░░███░░░░░███   ███░░░░░███ ░░███░░░░░███     ███░░░░░███  ███░░░░░███  ███░░░░░███
    ░███    ░███  ░███  ░███    ░███  ░███   ░░███ ░███    ░███  ███     ░░███ ░███    ░███    ░███    ░███ ░███    ░░░  ███     ░░░
    ░███████████  ░███  ░██████████   ░███    ░███ ░██████████  ░███      ░███ ░██████████     ░███████████ ░░█████████ ░███         
    ░███░░░░░███  ░███  ░███░░░░░███  ░███    ░███ ░███░░░░░███ ░███      ░███ ░███░░░░░░      ░███░░░░░███  ░░░░░░░░███░███         
    ░███    ░███  ░███  ░███    ░███  ░███    ███  ░███    ░███ ░░███     ███  ░███            ░███    ░███  ███    ░███░░███     ███
    █████   █████ █████ █████   █████ ██████████   █████   █████ ░░░███████░   █████           █████   █████░░█████████  ░░█████████
    ░░░░░   ░░░░░ ░░░░░ ░░░░░   ░░░░░ ░░░░░░░░░░   ░░░░░   ░░░░░    ░░░░░░░    ░░░░░           ░░░░░   ░░░░░  ░░░░░░░░░    ░░░░░░░░░  
   ==============================================
       BOT              : PENGUSWAP TESTNET
       Telegram Channel : @airdropasc               
       Telegram Group   : @autosultan_group         
   ==============================================
   `);
  }

  static getContract(contractName) {
    if (!(contractName in setup.constant)) {
      throw new Error(`Contract ${contractName} not found in contractAddress`);
    }
    return this.validateAddress(setup.constant[contractName]);
  }
}
