import Twist from "../../utils/twister.js";
import { Helper } from "../../utils/helper.js";

export default class ServiceManager {
  constructor(core) {
    this.coreInstance = core;
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  formatElapsedTime(elapsedTime) {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  formatTxHash(txHash) {
    return `${txHash.substring(0, 12)}...${txHash
      .slice(-12)
      .split("")
      .reverse()
      .join("")}`;
  }

  async handleTransactionError(error, amount, fromToken, toToken) {
    const errorMessage = error.message || "An unexpected error occurred.";
    const transactionHash = error.transactionHash || "N/A";
    const reason =
      transactionHash !== "N/A"
        ? await this.getTransactionError(transactionHash)
        : "Invalid transaction hash.";

    const formattedError = `${errorMessage} | Transaction Hash: ${this.formatTxHash(
      transactionHash
    )} | Reason: ${reason}`;
    this.coreInstance.handleError(
      `Swapping ${amount} ${fromToken} into ${toToken}`,
      formattedError
    );

    await this.sleep(5000);
    this.coreInstance.handleError(
      `Transaction failed with error: ${errorMessage}`,
      `Hash: ${this.formatTxHash(transactionHash)} | Reason: ${reason}`
    );
  }

  async getTransactionError(txHash) {
    try {
      const receipt = await this.coreInstance.provider.getTransactionReceipt(
        txHash
      );
      if (receipt?.logs) {
        for (const log of receipt.logs) {
          try {
            const errorEvent =
              this.coreInstance.contractInstances.swapRouter.interface.parseLog(
                log
              );
            if (errorEvent) return errorEvent.args[0];
          } catch {
            continue;
          }
        }
      }
      return "Unknown error.";
    } catch (error) {
      this.coreInstance.handleError(
        "Error fetching transaction receipt:",
        error
      );
      return "Error fetching transaction receipt.";
    }
  }

  async waitForTransactionConfirmation(txHash, action) {
    if (!txHash || !/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      this.coreInstance.handleError(action, "Invalid transaction hash.");
      return null;
    }

    const loading = this.startLoadingSpinner(
      Helper.animation,
      action,
      "Waiting for transaction confirmation..."
    );

    try {
      const receipt = await this.coreInstance.provider.waitForTransaction(
        txHash
      );
      clearInterval(loading);
      process.stdout.write("\r\x1b[K");

      if (receipt.status === 0) {
        const reason = await this.getTransactionError(txHash);
        this.coreInstance.handleError(
          action,
          `Transaction failed: ${reason || "Unknown error."}`
        );
        return null;
      }

      Twist.log(
        action,
        this.coreInstance.accounts,
        this.coreInstance,
        `✔️  Transaction ${this.formatTxHash(txHash)} confirmed.`
      );
      await this.sleep(2000);
      return receipt;
    } catch (error) {
      console.error(error);
      clearInterval(loading);
      process.stdout.write("\r\x1b[K");
      this.coreInstance.handleError(action, error);
      return null;
    }
  }

  async handleTransaction(fn, action) {
    try {
      const tx = await fn();
      if (tx?.hash) {
        Twist.log(
          action,
          this.coreInstance.accounts,
          this.coreInstance,
          `✔️  Transaction sent, txid: ${this.formatTxHash(tx.hash)}`
        );
        return tx;
      } else {
        console.error(error);
        this.coreInstance.handleError(action, "Transaction failed to send.");
        return null;
      }
    } catch (error) {
      console.error(error);
      this.coreInstance.handleError(
        action,
        `Error during transaction: ${error.message}`
      );
      return null;
    }
  }

  async retryTransaction(fn, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        console.error(error);
        if (error.code === "ECONNRESET" && attempt < maxAttempts) {
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await Helper.delay(
            backoffDelay,
            this.coreInstance.accounts,
            this.coreInstance,
            `Retrying... Attempt ${attempt + 1}/${maxAttempts}`,
            `Previous attempt failed: ${error.message}`
          );
        } else {
          this.coreInstance.handleError(
            "Transaction Retry Failed",
            "Max attempts reached."
          );
          return null;
        }
      }
    }
  }

  startLoadingSpinner(spinnerChars, action, message) {
    let elapsedTime = 0;
    return setInterval(() => {
      const timeString = this.formatElapsedTime(elapsedTime);
      Twist.log(
        action,
        this.coreInstance.accounts,
        this.coreInstance,
        `${
          spinnerChars[elapsedTime % spinnerChars.length]
        } ${timeString} ${message}`
      );
      elapsedTime++;
    }, 1000);
  }
}
