import { ethers } from "ethers";
import abi from "../abi.json";

const contractAddress =
  "0x7be6A27f85EABfC953C1141263fB682868d923cc";

export async function getContract(signerOrProvider) {

  return new ethers.Contract(
    contractAddress,
    abi,
    signerOrProvider
  );

}