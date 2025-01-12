import setup from "./setup.js";
import Core from "./src/core/core.js";

async function operateAccount(privateKey) {
  const core = new Core(privateKey);

  try {
    await core.getBalance(true);
    await core.runProcess();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

(async () => {
  if (!Array.isArray(setup.accounts) || setup.accounts.length < 1) {
    throw new Error("Please set up accounts.js first");
  }

  for (const key of setup.accounts) {
    operateAccount(key).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  }
})();
