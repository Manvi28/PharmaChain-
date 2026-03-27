import { ethers } from "ethers";
import abi from "../abi.json";

const contractAddress =
  "0x9814eeA9bD681b57D8743168F2E95D74AF0C92cD";

export async function getContract(signerOrProvider) {

  return new ethers.Contract(
    contractAddress,
    abi,
    signerOrProvider
  );

}