import { ethers } from "ethers";
import bn from "bignumber.js";
import Twist from "../../utils/twister.js";
import { nearestUsableTick } from "@uniswap/v3-sdk";
import { POOL_ABI } from "../../abi/abi.js";
import setup from "../../../setup.js";

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

export default class AddLiquidityManager {
  constructor(core, serviceManager) {
    this.coreInstance = core;
    this.serviceInstance = serviceManager;
  }

  async getPoolData(poolAddress) {
    const poolContract = new ethers.Contract(
      poolAddress,
      POOL_ABI,
      this.coreInstance.walletInstance
    );

    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
      poolContract.tickSpacing(),
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

    return {
      tickSpacing: tickSpacing,
      fee: fee,
      liquidity: liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    };
  }

  encodePriceSqrt(reserve1, reserve0) {
    const result = new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(bn.ROUND_DOWN)
      .toFixed();

    return BigInt(result);
  }

  async getPoolAddress(token0, token1, fee) {
    const poolAddress = await this.coreInstance.contracts.FACTORY.getPool(
      token0,
      token1,
      fee
    );
    return poolAddress;
  }

  async deployPool(token0, token1, fee, price) {
    try {
      let params = [
        ethers.getAddress(token0),
        ethers.getAddress(token1),
        fee,
        price,
      ];

      const [token0Details, token1Details] = await Promise.all([
        this.coreInstance.fetchTokenDetails(token0),
        this.coreInstance.fetchTokenDetails(token1),
      ]);

      let data =
        this.coreInstance.contracts.POSITION_MANAGER.interface.encodeFunctionData(
          "createAndInitializePoolIfNecessary",
          params
        );

      const transaction = {
        to: this.coreInstance.CONTRACT_ADDRESS.POSITION_MANAGER_ADDRESS,
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
        const action = `🔨 Deploying Liquidity Pool Contract for ${token0Details.symbol}/${token1Details.symbol}`;
        const tx = await this.serviceInstance.retryTransaction(async () => {
          return await this.serviceInstance.handleTransaction(
            async () =>
              await this.coreInstance.walletInstance.sendTransaction(
                transaction
              ),
            action
          );
        });

        if (!tx) {
          this.coreInstance.handleError(
            action,
            `❌ Transaction failed to send.`
          );
          return;
        }

        const transactionHash = tx.hash || "N/A";

        await this.serviceInstance.waitForTransactionConfirmation(
          transactionHash,
          action
        );

        const poolAddress = await this.coreInstance.contracts.FACTORY.getPool(
          token0,
          token1,
          fee
        );

        Twist.log(
          action,
          this.coreInstance.accounts,
          this.coreInstance,
          `✔️  Successfully deployed pool ${token0Details.symbol}/${token1Details.symbol} contract at: ${poolAddress}`
        );

        return poolAddress;
      } catch (error) {
        this.coreInstance.handleError(
          `Failed to deploy liquidity pool ${token0Details.symbol}/${token1Details.symbol}`,
          `${error.message}`
        );
      }
    } catch (error) {
      this.coreInstance.handleError(
        `Failed to deploy liquidity pool`,
        `${error.message}`
      );
    }
  }

  async addLiquidity(token0, token1, fee) {
    try {
      const [token0Details, token1Details, poolAddress] = await Promise.all([
        this.coreInstance.fetchTokenDetails(token0),
        this.coreInstance.fetchTokenDetails(token1),
        this.getPoolAddress(token0, token1, fee),
      ]);

      const poolData = await this.getPoolData(poolAddress);

      const params = [
        token0,
        token1,
        poolData.fee,
        nearestUsableTick(Number(poolData.tick), Number(poolData.tickSpacing)) -
          Number(poolData.tickSpacing) * 2,
        nearestUsableTick(Number(poolData.tick), Number(poolData.tickSpacing)) +
          Number(poolData.tickSpacing) * 2,
        BigInt(setup.liquidityPool0 * 1e18).toString(),
        BigInt(setup.liquidityPool1 * 1e18).toString(),
        0,
        0,
        this.coreInstance.address,
        Math.floor(Date.now() / 1000) + 60 * 10,
      ];

      let data =
        this.coreInstance.contracts.POSITION_MANAGER.interface.encodeFunctionData(
          "mint",
          [params]
        );

      const transaction = {
        to: this.coreInstance.CONTRACT_ADDRESS.POSITION_MANAGER_ADDRESS,
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
        const action = `🔨 Adding 100 \x1b[1m${token0Details.symbol}\x1b[0m and 100 \x1b[1m${token1Details.symbol}\x1b[0m to pool.`;
        const tx = await this.serviceInstance.retryTransaction(async () => {
          return await this.serviceInstance.handleTransaction(
            async () =>
              await this.coreInstance.walletInstance.sendTransaction(
                transaction
              ),
            action
          );
        });

        if (!tx) {
          this.coreInstance.handleError(
            action,
            `❌ Transaction failed to send.`
          );
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
          `✔️  Successfully added liquidity 100 ${token0Details.symbol} and 100 ${token1Details.symbol} to pool.`
        );
      } catch (error) {
        this.coreInstance.handleError(
          `Failed to add liquidity to pool`,
          `${error.message}`
        );

        return null;
      }
    } catch (error) {
      console.error(error);
      this.coreInstance.handleError(
        `Failed to added liquidity!`,
        `${error.message}`
      );
    }
  }

  async collectFee(positionId) {
    try {
      const { POSITION_MANAGER } = this.coreInstance.contracts;

      const params = [
        positionId,
        this.coreInstance.address,
        340282366920938463463374607431768211455n,
        340282366920938463463374607431768211455n,
      ];

      let data = POSITION_MANAGER.interface.encodeFunctionData("collect", [
        params,
      ]);

      const transaction = {
        to: this.coreInstance.CONTRACT_ADDRESS.POSITION_MANAGER_ADDRESS,
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
        const action = `🔨 Collecting fee for possitionId ${positionId.toString()}`;
        const tx = await this.serviceInstance.retryTransaction(async () => {
          return await this.serviceInstance.handleTransaction(
            async () =>
              await this.coreInstance.walletInstance.sendTransaction(
                transaction
              ),
            action
          );
        });

        if (!tx) {
          this.coreInstance.handleError(
            action,
            `❌ Transaction failed to send.`
          );
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
          `✔️  Successfully Collecting fee for possitionId ${positionId.toString()}`
        );
      } catch (error) {
        this.coreInstance.handleError(
          `Failed to Collecting fee`,
          `${error.message}`
        );

        return null;
      }
    } catch (error) {
      console.error(error);
      this.coreInstance.handleError(
        `Failed to collecting Fee!`,
        `${error.message}`
      );
    }
  }
}
