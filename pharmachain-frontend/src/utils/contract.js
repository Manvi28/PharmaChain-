import { ethers } from "ethers";
import abi from "../abi.json";

const contractAddress =
  "0xfe7931baDEbB79cF0919cEfB6aA72C5D4335526d";

export async function getContract(signerOrProvider) {

  return new ethers.Contract(
    contractAddress,
    abi,
    signerOrProvider
  );

}