import { ethers } from "ethers";

import Twist from "../../utils/twister.js";
import { ERC20_ABI } from "../../abi/abi.js";
import setup from "../../../setup.js";

export default class TokenManager {
  constructor(core, serviceManagerInstance) {
    this.coreInstance = core;
    this.serviceManager = serviceManagerInstance;
  }

  async checkAllowance(tokenAddress, spender, owner) {
    const smartContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      this.coreInstance.walletInstance
    );
    return await smartContract.allowance(owner, spender);
  }

  async approveToken(token0, spender) {
    try {
      const smartContract = new ethers.Contract(
        token0,
        ERC20_ABI,
        this.coreInstance.walletInstance
      );

      const tokenName = await smartContract.symbol();
      const actions = `Approving ${tokenName} Into ${spender}`;

      const data = smartContract.interface.encodeFunctionData("approve", [
        spender,
        ethers.MaxUint256.toString(),
      ]);

      const transaction = {
        to: token0,
        from: this.coreInstance.address,
        value: 0,
        data: data,
        gasLimit: this.coreInstance.FIXED_GAS_LIMIT,
        gasPrice: this.coreInstance.FIXED_GAS_PRICE,
        nonce: await this.coreInstance.provider.getTransactionCount(
          this.coreInstance.address
        ),
      };

      try {
        const tx = await this.serviceManager.retryTransaction(async () => {
          return await this.serviceManager.handleTransaction(
            async () =>
              await this.coreInstance.walletInstance.sendTransaction(
                transaction
              ),
            actions
          );
        });

        if (!tx) {
          this.coreInstance.handleError(actions, `Transaction failed to send.`);
          this.coreInstance.swapCount++;
          return;
        }

        const transactionHash = tx.hash || "N/A";
        await this.serviceManager.waitForTransactionConfirmation(
          transactionHash,
          actions
        );

        Twist.log(
          `${actions}`,
          this.coreInstance.accounts,
          this.coreInstance,
          `✔️  ${actions} success`
        );
      } catch (error) {
        console.error(error);
        this.coreInstance.handleError(`❌ ${actions} failed`, error.message);
      }
    } catch (error) {
      console.error(error);
      this.coreInstance.handleError("❌ Approving token failed", error.message);
    }
  }

  async wrap(amountIn, actionType = false) {
    try {
      const isWrap = actionType === "wrap";
      const methodName = isWrap ? "deposit" : "withdraw";
      const encode =
        this.coreInstance.contracts.WCTC.interface.encodeFunctionData(
          methodName,
          isWrap ? [] : [amountIn.toString()]
        );

      const transaction = {
        to: setup.constant.WCTC_ADDRESS,
        from: this.coreInstance.address,
        value: isWrap ? ethers.parseEther(amountIn) : 0,
        data: encode,
        gasLimit: this.coreInstance.FIXED_GAS_LIMIT,
        gasPrice: this.coreInstance.FIXED_GAS_PRICE,
        nonce: await this.coreInstance.provider.getTransactionCount(
          this.coreInstance.address
        ),
      };

      const action = isWrap
        ? `🔄 Wrapping ${Number(amountIn).toFixed(8)} CTC into WCTC`
        : `🔄 Unwrapping ${Number(ethers.formatUnits(amountIn, 18)).toFixed(
            8
          )} WCTC into CTC`;

      const tx = await this.serviceManager.retryTransaction(() =>
        this.serviceManager.handleTransaction(
          () => this.coreInstance.walletInstance.sendTransaction(transaction),
          action
        )
      );

      if (!tx) {
        this.coreInstance.handleError(action, `❌ Transaction failed to send.`);
        return;
      }
      await this.serviceManager.waitForTransactionConfirmation(tx.hash, action);

      Twist.log(
        `${action}`,
        this.coreInstance.accounts,
        this.coreInstance,
        isWrap
          ? `✔️  Wrapping ${Number(amountIn).toFixed(8)} CTC to WCTC success`
          : `✔️  Unwrapping ${Number(ethers.formatUnits(amountIn, 18)).toFixed(
              8
            )} WCTC to CTC success`
      );
    } catch (error) {
      this.coreInstance.handleError(`Failed to wrap CTC`, `${error.message}`);
    }
  }
}
