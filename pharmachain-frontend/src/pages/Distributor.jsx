import { useState } from "react";
import { connectWallet } from "../utils/web3";
import { getContract } from "../utils/contract";

export default function Distributor(){

const [batchId,setBatchId]=useState("");
const [owner,setOwner]=useState("");

async function transfer(){

const signer=await connectWallet();
const contract=await getContract(signer);

await contract.transferOwnership(batchId,owner);

alert("Ownership transferred");

}

return(

<div className="container">

<div className="card">

<h2>Transfer Ownership</h2>

<input placeholder="Batch ID"
onChange={e=>setBatchId(e.target.value)}
/>

<input placeholder="New Owner Address"
onChange={e=>setOwner(e.target.value)}
/>

<button onClick={transfer}>
Transfer Ownership
</button>

</div>

</div>

)

}