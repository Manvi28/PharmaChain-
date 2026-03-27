import { useState, useEffect } from "react";
import { connectWallet } from "../utils/web3";
import { getContract } from "../utils/contract";
import { getBatches, updateBatchHistory } from "../utils/batchStorage";
import { ethers } from "ethers";
import "../styles/distributor.css";

export default function Distributor(){

const [batchId,setBatchId]=useState("");
const [owner,setOwner]=useState("");

// NEW STATES
const [batches,setBatches]=useState([]);
const [viewBatch,setViewBatch]=useState(null);

// LOAD LOCAL STORAGE BATCHES
useEffect(()=>{
  setBatches(getBatches());
},[]);

// 🔍 VIEW BATCH FROM BLOCKCHAIN
async function fetchBatch(){

const provider = new ethers.BrowserProvider(window.ethereum);
const contract = await getContract(provider);

const result = await contract.getBatch(batchId);

setViewBatch(result);

}

// 🔄 TRANSFER OWNERSHIP (CORE LOGIC + SAFETY)
async function transfer(){

const signer=await connectWallet();
const address = await signer.getAddress();

const contract=await getContract(signer);

// 🔥 check ownership (IMPORTANT FIX)
const batch = await contract.getBatch(batchId);

if(batch.currentOwner.toLowerCase() !== address.toLowerCase()){
  alert("You are not the current owner");
  return;
}

// ORIGINAL LOGIC
await contract.transferOwnership(batchId,owner);

// UPDATE LOCAL STORAGE (FOR SUPPLY CHAIN)
updateBatchHistory(batchId, owner);

setBatches(getBatches());

alert("Ownership transferred");

}

return(

<div className="distributor-page">
  <div className="distributor-grid">

{/* TRANSFER OWNERSHIP */}
<div className="distributor-card">

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

{/* VIEW BATCH DETAILS */}
<div className="distributor-card">

<h3>View Batch Details</h3>

<input placeholder="Enter Batch ID"
onChange={e=>setBatchId(e.target.value)}
/>

<button onClick={fetchBatch}>
Fetch Details
</button>

{viewBatch && (

<div className="view-result">

<p><b>Medicine:</b> {viewBatch.medicineName}</p>
<p><b>Location:</b> {viewBatch.location}</p>
<p><b>Owner:</b> {viewBatch.currentOwner}</p>
<p><b>Status:</b> {viewBatch.status.toString()}</p>

</div>

)}

</div>

{/* RECEIVED BATCHES */}
<div className="distributor-card">

<h3>Available Batches (Local)</h3>

{batches.length === 0 && <p>No batches found</p>}

{batches.map(b=>(
<div key={b.batchId} className="batch-item">

<p><b>{b.batchId}</b></p>
<p>Medicine: {b.medicine}</p>
<p>Owner: {b.owner}</p>

</div>
))}

</div>

</div>
</div>
)
}