import { ethers } from "ethers";
import setup from "../../setup.js";
import {
  WCTC_ABI,
  ERC20_ABI,
  ROUTER_ABI,
  POSITION_ABI,
  FACTORY_ABI,
} from "../abi/abi.js";
import { Helper } from "../utils/helper.js";
import Twist from "../utils/twister.js";
import DeployTokenManager from "./service/deployManager.js";
import TokenManager from "./service/tokenManager.js";
import AddLiquidityManager from "./service/addLiquidityManager.js";
import ServiceManager from "./service/serviceManager.js";
import SwapManager from "./service/swapManager.js";
export default class Core {
  constructor(accounts) {
    if (!accounts) throw new Error("Accounts are required");

    const { rpc, gasSetting, constant } = setup;

    this.provider = new ethers.JsonRpcProvider(rpc.url);
    this.accounts = accounts;
    this.ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    this.CONTRACT_ADDRESS = constant;
    this.walletInstance = new ethers.Wallet(accounts, this.provider);
    this.address = Helper.validateAddress(this.walletInstance.address);
    this.FIXED_GAS_LIMIT = gasSetting.gasLimit;
    this.FIXED_GAS_PRICE = ethers.parseUnits(
      gasSetting.gasPrice.toString(),
      "gwei"
    );
    this.serviceManager = new ServiceManager(this);
    this.deployTokenManager = new DeployTokenManager(this);
    this.tokenManager = new TokenManager(this, this.serviceManager);
    this.swapManager = new SwapManager(this, this.serviceManager);

    this.addLiquidityManager = new AddLiquidityManager(
      this,
      this.serviceManager
    );

    this.contracts = this.initializeContracts(constant);
  }

  initializeContracts(constant) {
    const {
      WCTC_ADDRESS,
      ROUTER_ADDRESS,
      USDC_ADDRESS,
      FACTORY_ADDRESS,
      POSITION_MANAGER_ADDRESS,
    } = constant;
    const contractData = [
      { name: "WCTC", address: WCTC_ADDRESS, abi: WCTC_ABI },
      { name: "ROUTER", address: ROUTER_ADDRESS, abi: ROUTER_ABI },
      { name: "USDC", address: USDC_ADDRESS, abi: ERC20_ABI },
      { name: "FACTORY", address: FACTORY_ADDRESS, abi: FACTORY_ABI },
      {
        name: "POSITION_MANAGER",
        address: POSITION_MANAGER_ADDRESS,
        abi: POSITION_ABI,
      },
    ];

    return contractData.reduce((contracts, { name, address, abi }) => {
      contracts[name] = new ethers.Contract(address, abi, this.walletInstance);
      return contracts;
    }, {});
  }

  async getBalance(update = false) {
    try {
      const balance = await this.provider.getBalance(this.address);
      if (update) this.balance = balance.toString();
      return ethers.formatEther(balance);
    } catch (error) {
      this.handleError("Failed fetching balance", error.message);
    }
  }

  async deployToken(name, symbol, supply) {
    const action = `🔨 Deploying contract \x1b[1m${name} (${symbol})\x1b[0m`;
    await Helper.delay(
      5000,
      this.accounts,
      this,
      action,
      "Preparing to deploy"
    );

    try {
      const contractAddress = await this.deployTokenManager.deployContract(
        name,
        symbol,
        supply
      );

      if (contractAddress === this.ZERO_ADDRESS) {
        console.log(contractAddress);
        throw new Error("Contract address is zero address");
      }

      Twist.log(
        action,
        this.accounts,
        this,
        `✔️  Contract deployed successfully at \x1b[1m${contractAddress}`
      );
      await this.sleep(3000);
      return contractAddress;
    } catch (error) {
      this.handleError(action, error.message);
      process.exit(1);
    }
  }

  async processWCTC(amountIn, actionType = false) {
    const isWrap = actionType === "wrap";

    amountIn = isWrap
      ? amountIn
      : await this.contracts.WCTC.balanceOf(this.address);

    const action = isWrap
      ? `Wrapping ${Number(amountIn).toFixed(8)} CTC into WCTC`
      : `Unwrapping ${Number(
          ethers.formatUnits(amountIn.toString(), 18)
        ).toFixed(8)} WCTC into CTC`;

    await Helper.delay(
      5000,
      this.accounts,
      this,
      `🔄 ${action}`,
      `Preparing to ${action}`
    );
    return await this.tokenManager.wrap(amountIn, actionType);
  }

  async fetchTokenDetails(tokenAddress) {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      this.walletInstance
    );
    const [symbol, name, decimal] = await Promise.all([
      tokenContract.symbol(),
      tokenContract.name(),
      tokenContract.decimals(),
    ]);
    return { symbol, name, decimal };
  }

  async processApprove(tokenAddress, spender) {
    const { symbol, name } = await this.fetchTokenDetails(tokenAddress);
    const action = `Approving \x1b[1m${symbol}\x1b[0m Into ${spender}`;
    await Helper.delay(
      5000,
      this.accounts,
      this,
      `🔄 ${action}`,
      `Preparing to approve \x1b[1m${symbol}\x1b[0m`
    );

    const currentAllowance = await this.tokenManager.checkAllowance(
      tokenAddress,
      ethers.getAddress(spender),
      this.address
    );

    if (currentAllowance.toString() === ethers.MaxUint256.toString()) {
      const actions = `No approval needed for \x1b[1m${symbol}\x1b[0m token.`;

      return Twist.log(actions, this.accounts, this, `✔️  Already approved!`);
    }
    await this.getBalance(true);
    return this.tokenManager.approveToken(tokenAddress, spender);
  }

  async deployPool(token0, token1, fee, price) {
    const [token0Details, token1Details] = await Promise.all([
      this.fetchTokenDetails(token0),
      this.fetchTokenDetails(token1),
    ]);

    const action = `Deploying Liquidity Pool Contract for ${token0Details.symbol}/${token1Details.symbol}`;

    await Helper.delay(
      5000,
      this.accounts,
      this,
      `🔨  ${action}`,
      `Preparing to ${action}`
    );

    const poolAddress = await this.addLiquidityManager.deployPool(
      token0,
      token1,
      fee,
      price
    );

    if (poolAddress === this.ZERO_ADDRESS) {
      Twist.log(action, this.accounts, this, `❌ Failed to ${action}`);
      return process.exit(1);
    }
    await this.getBalance(true);
    return poolAddress;
  }

  async addLiquidity(token0, token1, fee) {
    const [token0Details, token1Details] = await Promise.all([
      this.fetchTokenDetails(token0),
      this.fetchTokenDetails(token1),
    ]);
    const action = `Adding 100 ${token0Details.symbol} and 100 ${token1Details.symbol} to pool.`;

    await Helper.delay(
      5000,
      this.accounts,
      this,
      `🔨  ${action}`,
      `Preparing to ${action}`
    );
    await this.getBalance(true);
    return await this.addLiquidityManager.addLiquidity(token0, token1, fee);
  }

  async performSwap(amountIn, token0, token1, fee, isSwapToCtc) {
    const [token0Details, token1Details] = await Promise.all([
      this.fetchTokenDetails(token0),
      this.fetchTokenDetails(token1),
    ]);

    const action = `Swaping \x1b[1m${token0Details.symbol}\x1b[0m Into \x1b[1m${token1Details.symbol}\x1b[0m`;
    await Helper.delay(
      5000,
      this.accounts,
      this,
      `🔄 ${action}`,
      `Preparing to swap ${token0Details.symbol} Into ${token1Details.symbol}`
    );
    await this.getBalance(true);
    return await this.swapManager.swapToken(
      token0,
      token1,
      amountIn,
      fee,
      isSwapToCtc
    );
  }

  async getPositions() {
    const { POSITION_MANAGER } = this.contracts;

    try {
      const positionCount = await POSITION_MANAGER.balanceOf(this.address);

      for (let i = 0; i < positionCount; i++) {
        const positionId = await POSITION_MANAGER.tokenOfOwnerByIndex(
          this.address,
          i
        );
        const { feeGrowthInside0LastX128, feeGrowthInside1LastX128 } =
          await POSITION_MANAGER.positions(positionId);

        const action = `Collecting fee for positionId ${positionId.toString()}`;

        if (
          feeGrowthInside1LastX128 > BigInt(0) ||
          feeGrowthInside0LastX128 > BigInt(0)
        ) {
          await Helper.delay(
            5000,
            this.accounts,
            this,
            action,
            `Preparing to ${action}`
          );

          await this.addLiquidityManager.collectFee(positionId);
        } else {
          Twist.log(
            action,
            this.accounts,
            this,
            `❌ No fees to collect for positionId ${positionId.toString()}`
          );
        }
      }
    } catch (error) {
      this.handleError("Error fetching positions:", error.message);
    }
  }

  async runProcess() {
    try {
      Helper.showSkelLogo();
      await this.sleep(3000); // Display logo

      // Step 1: Deploy token
      const contractAddress = await this.deployToken(
        setup.token.name,
        setup.token.symbol,
        setup.token.supply
      );

      await this.sleep(3000);

      // Step 2: Wrap WCTC
      await this.processWCTC(setup.liquidityPool0.toString(), "wrap");
      await this.sleep(3000);

      // Approve tokens
      const approvals = [
        [
          this.CONTRACT_ADDRESS.WCTC_ADDRESS,
          this.CONTRACT_ADDRESS.POSITION_MANAGER_ADDRESS,
        ],
        [contractAddress, this.CONTRACT_ADDRESS.POSITION_MANAGER_ADDRESS],
      ];
      for (const approval of approvals) await this.processApprove(...approval);
      await this.sleep(3000);

      // Step 3: Deploy pool and add liquidity
      await this.deployPool(
        this.CONTRACT_ADDRESS.WCTC_ADDRESS,
        contractAddress,
        3000,
        this.addLiquidityManager.encodePriceSqrt(1, 1)
      );
      await this.sleep(3000);

      await this.addLiquidityManager.addLiquidity(
        this.CONTRACT_ADDRESS.WCTC_ADDRESS,
        contractAddress,
        3000
      );
      await this.sleep(3000);

      // Step 4: Perform swaps
      const swaps = [
        [
          "10",
          this.CONTRACT_ADDRESS.WCTC_ADDRESS,
          this.CONTRACT_ADDRESS.USDC_ADDRESS,
          500,
          false,
        ],
        [
          "0",
          this.CONTRACT_ADDRESS.USDC_ADDRESS,
          this.CONTRACT_ADDRESS.WCTC_ADDRESS,
          500,
          true,
        ],
        [
          "10",
          this.CONTRACT_ADDRESS.WCTC_ADDRESS,
          contractAddress,
          3000,
          false,
        ],
      ];
      for (const swap of swaps) {
        await this.performSwap(...swap);
        await this.sleep(3000);
      }

      // Step 5: Unwrap WCTC and fetch positions
      await this.processWCTC("0", false);
      await this.sleep(3000);

      await this.getPositions();
      await this.getBalance(true);

      // Log completion
      Twist.log(
        `Process has completed successfully for address: ${this.address}`,
        this.accounts,
        this,
        `✔️  All process has been completed.`
      );
    } catch (error) {
      this.handleError("Error during process execution:", error.message);
      process.exit(1);
    }
  }

  async handleError(action, error) {
    Twist.log(action, this.accounts, this, `❌ Error: ${error}`);
    await this.sleep(3500);
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
