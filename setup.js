export default class setup {
  static accounts = [
    "",
    // "",
    //add more privateKey
  ];

  static token = {
    name: "Taiko Token",
    symbol: "Taiko",
    supply: 10005,
  };

  static gasSetting = {
    gasLimit: 50000000,
    gasPrice: 10,
  };

  static rpc = {
    url: "https://rpc.cc3-testnet.creditcoin.network",
    chainId: 102031,
  };

  static constant = {
    WCTC_ADDRESS: "0x56072113e08015e1c40A3F3f656b1C1Fa78E329E",
    ROUTER_ADDRESS: "0x052ffAaAe6e24a1ff9F197c46c29dfdB53Bd61F5",
    USDC_ADDRESS: "0xa1Cc4d7aa040eA903fd00c13E7b43f8e26cbB7F8",
    POSITION_MANAGER_ADDRESS: "0x74501E231E1e8f505Fed029a1B48122114d1f51F",
    FACTORY_ADDRESS: "0x7316C24Cb58a49673DdC3EE369d20806083BA48C",
  };

  static liquidityPool0 = "1000"; //add 100 WCTC
  static liquidityPool1 = "1000"; //add 100 Token
}
