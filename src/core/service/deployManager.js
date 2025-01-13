import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import solc from "solc";
import { solidityCode } from "./source.js";
import { ethers } from "ethers";
import Twist from "../../utils/twister.js";
import { Helper } from "../../utils/helper.js";
import ServiceManager from "./serviceManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class DeployTokenManager {
  constructor(core) {
    this.coreInstance = core;
    this.serviceManager = new ServiceManager(this.coreInstance);
  }

  saveSolidityFile = (contractName, code) => {
    const contractFolder = path.join(__dirname, "contracts");

    // Pastikan folder 'contracts' ada
    if (!fs.existsSync(contractFolder)) {
      fs.mkdirSync(contractFolder, { recursive: true });
      Twist.log(
        "💨 Folder contracts tidak ada, membuat folder...",
        this.coreInstance.accounts,
        this.coreInstance,
        `✔️ Folder contracts berhasil dibuat`
      );
    }

    const filePath = path.join(contractFolder, `${contractName}.sol`);
    fs.writeFileSync(filePath, code, "utf8");
    Twist.log(
      `💨 Saving Contract ${contractName}.sol`,
      this.coreInstance.accounts,
      this.coreInstance,
      `✔️  Contract ${contractName}.sol saved at ${filePath}`
    );
  };

  compileContract = async (contractName) => {
    const sourceCode = solidityCode(contractName);

    this.saveSolidityFile(contractName, sourceCode);

    const contractPath = path.join(
      __dirname,
      "contracts",
      `${contractName}.sol`
    );
    const source = fs.readFileSync(contractPath, "utf8");
    const input = {
      language: "Solidity",
      sources: {
        [`${contractName}.sol`]: {
          content: source,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode.object"],
          },
        },
      },
    };
    await Helper.delay(
      3000,
      this.coreInstance.accounts,
      this.coreInstance,
      `💨 Try Compiling contract ${contractName}`,
      `Compiling contract...`
    );

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
      output.errors.forEach((err) => {
        console.error(err);
      });
      this.coreInstance.handleError(
        "Error during contract compilation",
        output.errors
      );
    }
    Twist.log(
      `💨 Compiling contract ${contractName}`,
      this.coreInstance.accounts,
      this.coreInstance,
      `✔️  Compilation Contract ${contractName} successful!`
    );

    const compiledContract =
      output.contracts[`${contractName}.sol`][contractName];

    if (!compiledContract) {
      this.coreInstance.handleError(
        `Failed to compile \x1b[1m${contractName}\x1b[0m`,
        `Failed to compile contract: \x1b[1m${contractName}\x1b[0m not found in output.`
      );
    }

    return {
      bytecode: compiledContract.evm.bytecode.object,
      abi: compiledContract.abi,
    };
  };

  async deployContract(name, symbol, supply) {
    const contractName = name.replace(/\s+/g, "");
    const action = `🔨 Deploying contract \x1b[1m${name} (${symbol})\x1b[0m`;
    await Helper.delay(
      5000,
      this.coreInstance.accounts,
      this.coreInstance,
      action,
      "Preparing to deploy"
    );
    try {
      const { bytecode, abi } = await this.compileContract(contractName);

      if (!bytecode || !abi) {
        this.coreInstance.handleError(
          "❌ Deployment failed",
          "Bytecode or ABI is missing from the compiled contract"
        );
      }

      const factory = new ethers.ContractFactory(
        abi,
        bytecode,
        this.coreInstance.walletInstance
      );

      const action = `🔨 Start to deploy contract \x1b[1m${name} (${symbol})\x1b[0m`;
      const loading = this.serviceManager.startLoadingSpinner(
        Helper.animation,
        action,
        "Waiting for transaction confirmation..."
      );

      const contract = await factory.deploy(18, symbol, name, supply, {
        gasLimit: this.coreInstance.FIXED_GAS_LIMIT,
        gasPrice: this.coreInstance.FIXED_GAS_PRICE,
      });
      await contract.deploymentTransaction();
      await contract.waitForDeployment();
      clearInterval(loading);
      process.stdout.write("\r\x1b[K");
      Twist.log(
        `💨 Deploying contract ${contractName}`,
        this.coreInstance.accounts,
        this.coreInstance,
        `✔️  Deploying Contract ${contractName} : ${contract.target} successful!`
      );
      return contract.target;
    } catch (error) {
      console.log(error);
      this.coreInstance.handleError(`❌ Deployment failed`, error.message);
      return null;
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
