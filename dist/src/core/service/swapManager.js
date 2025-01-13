import { ethers } from "ethers";
import { ERC20_ABI } from "../../abi/abi.js";
import Twist from "../../utils/twister.js";
export default class SwapManager {
  constructor(core, serviceManager) {
    this.coreInstance = core;
    this.serviceInstance = serviceManager;
  }

  async swapToken(token0, token1, amountIn, fee, isSwapToCtc = false) {
    try {
      const token0Contract = new ethers.Contract(
        token0,
        ERC20_ABI,
        this.coreInstance.walletInstance
      );

      const [token0Details, token1Details] = await Promise.all([
        this.coreInstance.fetchTokenDetails(token0),
        this.coreInstance.fetchTokenDetails(token1),
      ]);

      let balance = amountIn;
      if (isSwapToCtc) {
        balance = await token0Contract.balanceOf(this.coreInstance.address);
        await this.coreInstance.processApprove(
          token0,
          this.coreInstance.CONTRACT_ADDRESS.ROUTER_ADDRESS
        );
      }

      const params = [
        token0,
        token1,
        fee,
        this.coreInstance.address,
        Math.floor(Date.now() / 1000) + 1800,
        isSwapToCtc
          ? balance.toString()
          : ethers.parseEther(balance.toString()),
        0,
        0,
      ];

      const data =
        this.coreInstance.contracts.ROUTER.interface.encodeFunctionData(
          "exactInputSingle",
          [params]
        );

      const formatAmount = isSwapToCtc
        ? Number(
            Number(balance.toString()) /
              Number(10 ** token0Details.decimal.toString())
          ).toFixed(8)
        : Number(balance).toFixed(8);

      const transaction = {
        to: this.coreInstance.CONTRACT_ADDRESS.ROUTER_ADDRESS,
        from: this.coreInstance.address,
        value: isSwapToCtc ? 0 : ethers.parseEther(balance.toString()),
        data: data,
        gasLimit: this.coreInstance.FIXED_GAS_LIMIT,
        gasPrice: this.coreInstance.FIXED_GAS_PRICE,
        nonce: await this.coreInstance.provider.getTransactionCount(
          this.coreInstance.address
        ),
      };

      const action = `🔄 Swapping ${formatAmount} ${token0Details.symbol} to ${token1Details.symbol}`;

      const tx = await this.serviceInstance.retryTransaction(async () => {
        return await this.serviceInstance.handleTransaction(
          async () =>
            await this.coreInstance.walletInstance.sendTransaction(transaction),
          action
        );
      });

      if (!tx) {
        this.coreInstance.handleError(action, `Transaction failed to send.`);
        return;
      }

      const transactionHash = tx.hash || "N/A";
      await this.serviceInstance.waitForTransactionConfirmation(
        transactionHash,
        action
      );

      Twist.log(
        `${action}`,
        this.coreInstance.accounts,
        this.coreInstance,
        `✔️  Swapping ${formatAmount} ${token0Details.symbol} for ${token1Details.symbol} was successful!`
      );
    } catch (error) {
      console.error(error);
      await this.coreInstance.handleError(
        "Failed to swap tokens",
        error.message
      );
      return null;
    }
  }
}
