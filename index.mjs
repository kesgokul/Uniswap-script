import { ethers } from "ethers";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const FACTORY_ABI = require("./constants/UniswapV3Factory.json");
const POOL_ABI = require("./constants/UniswapV3Pool.json");
import { tokenAddresses } from "./constants/networkConfig.js";
import abiDecoder from "abi-decoder";
import dotenv from "dotenv";
dotenv.config();
const mainnetRpc = process.env.MAINNET_RPC;
const mainnetWss = process.env.MAINNET_WS;
const uniswapFactoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const uniswapV3RouterAddress = "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45";
// const { tokenAddresses } = pkg;

const provider = new ethers.providers.WebSocketProvider(mainnetWss);
const { chainId } = await provider.getNetwork();
console.log(chainId);
const wallet = new ethers.Wallet.createRandom();
const signer = wallet.connect(provider);

const daiTokenAddress = tokenAddresses[chainId]["dai"];
const usdcTokenAddress = tokenAddresses[chainId]["usdc"];
const fee = 100;

const uniswapV3Factory = new ethers.Contract(
  uniswapFactoryAddress,
  FACTORY_ABI,
  signer
);

const poolAddress = await uniswapV3Factory.getPool(
  daiTokenAddress,
  usdcTokenAddress,
  fee
);

const uniswapPool = new ethers.Contract(poolAddress, POOL_ABI, signer);
uniswapPool.on("Swap", (sender, recepient, amount0, amount1, event) => {
  const swapEvent = {
    sender: sender,
    recepient: recepient,
    amount0: ethers.utils.formatEther(amount0),
    amount1: ethers.utils.formatEther(amount1),
    transactionhash: event.data,
  };
  console.log(JSON.stringify(swapEvent));
});

// console.log(poolAddress);

// const filter = {
//   address: daiTokenAddress,
//   topics: [ethers.utils.id("Transfer(address,address,uint256)")],
//   fromBlock: 16398000,
//   to: "latest",
// };

// const logs = await provider.getLogs(filter);
// console.log(ethers.utils.id("Transfer(address,address,uint256)"));

// provider.on("pending", (tx) => {
//   if (tx.hash) {
//     console.log(`Tx Hash: ${tx.hash}`);
//     provider.getTransaction(tx.hash).then((transaction) => {
//       console.log(transaction);
//     });
//   }
// });
// console.log(
//   await provider.getTransaction(
//     "0xc94fd448c23e1e5b4a109bc53a30da3d78196e96b7dae041c273afca2b9b0853"
//   )
// );
