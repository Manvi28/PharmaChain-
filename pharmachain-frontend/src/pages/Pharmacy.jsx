import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";
import { getBatches, updateBatchStatusLocal } from "../utils/batchStorage";
import { connectWallet } from "../utils/web3";
import "../styles/pharmacy.css";

export default function Pharmacy(){

const [batchId,setBatchId]=useState("");
const [data,setData]=useState(null);
const [history,setHistory]=useState([]);
const [status,setStatus]=useState("");
const [batches,setBatches]=useState([]);
const [address,setAddress]=useState("");

// 🔐 load wallet + batches
useEffect(()=>{
  async function load(){
    const signer = await connectWallet();
    const addr = await signer.getAddress();
    setAddress(addr);

    setBatches(getBatches());
  }
  load();
},[]);

// 🔥 FILTER ONLY PHARMACY OWNED BATCHES
const myBatches = batches.filter(
  b => address && b.owner.toLowerCase() === address.toLowerCase()
);

// 🔥 MARK AS SOLD
async function markSold(id){
  try{
    const signer = await connectWallet();
    const contract = await getContract(signer);

    await contract.updateBatchStatus(id, 3);

    // ✅ update local storage
    updateBatchStatusLocal(id, "sold");

    // ✅ refresh UI
    setBatches(getBatches());

    alert("Marked as Sold");

  }catch(err){
    console.log(err);
    alert("Failed");
  }
}

// 🔥 MARK AS DAMAGED
async function markDamaged(id){
  try{
    const signer = await connectWallet();
    const contract = await getContract(signer);

    await contract.updateBatchStatus(id, 5);

    // ✅ update local storage
    updateBatchStatusLocal(id, "damaged");

    // ✅ refresh UI
    setBatches(getBatches());

    alert("Marked as Damaged");

  }catch(err){
    console.log(err);
    alert("Failed");
  }
}

// 🔍 FETCH + VERIFY
async function fetchBatch(){

try{

const provider=new ethers.BrowserProvider(window.ethereum);
const contract=await getContract(provider);

const result=await contract.getBatch(batchId);

setData(result);

const batches = getBatches();
const localBatch = batches.find(b => b.batchId === batchId);

if(localBatch){
  setHistory(localBatch.history);

  if(localBatch.history.length >= 2){
    setStatus("authentic");
  } else {
    setStatus("suspicious");
  }

}else{
  setHistory([]);
  setStatus("not_found");
}

}catch(err){
  console.log(err);
  alert("Batch not found or error occurred");
}

}

return(

<div className="pharmacy-page">
  <div className="pharmacy-card">

<h2>Pharmacy Dashboard</h2>

{/* VERIFY */}
<div className="section">

<h3>Verify Drug Batch</h3>

<input 
placeholder="Batch ID"
onChange={e=>setBatchId(e.target.value)}
/>

<button onClick={fetchBatch}>
Verify
</button>

</div>

{/* BLOCKCHAIN DATA */}
{data &&(

<div className="section">

<h3>Batch Details</h3>

<p><b>Medicine:</b> {data.medicineName}</p>
<p><b>Location:</b> {data.location}</p>
<p><b>Expiry:</b> {data.expiryDate.toString()}</p>
<p><b>Current Owner:</b> {data.currentOwner}</p>

</div>

)}

{/* SUPPLY CHAIN */}
{history.length > 0 && (

<div className="section">

<h3>Supply Chain</h3>

{history.map((h,i)=>(
<div key={i} className="chain-step">
{h.step} → {h.owner}
</div>
))}

</div>

)}

{/* STATUS */}
{status && (

<div className="section">

<h3>Status</h3>

<div className={`status-box 
  ${status==="authentic"?"status-auth":""}
  ${status==="suspicious"?"status-suspicious":""}
  ${status==="not_found"?"status-error":""}
`}>

  {status==="authentic" && "✔ Authentic Medicine"}
  {status==="suspicious" && "⚠ Incomplete Supply Chain"}
  {status==="not_found" && "❌ No Record Found"}

</div>

</div>

)}

{/* 🔥 YOUR BATCHES */}
<div className="section">

<h3>Your Batches</h3>

{myBatches.length === 0 && <p>No batches assigned to you</p>}

{myBatches.map(b => (

<div key={b.batchId} className="batch-card">

<p><b>{b.batchId}</b></p>
<p>Medicine: {b.medicine}</p>
<p>Owner: {b.owner}</p>

{/* ✅ STATUS DISPLAY */}
<p>
Status: {
  b.status === "damaged" ? "❌ Damaged" :
  b.status === "sold" ? "✔ Sold" :
  "In Progress"
}
</p>

{/* ✅ DISABLE BUTTONS AFTER UPDATE */}
{b.status === "sold" || b.status === "damaged" ? (
  <p style={{fontWeight:"bold"}}>
    {b.status === "sold" ? "✔ Already Sold" : "❌ Damaged"}
  </p>
) : (
  <div className="action-buttons">

    <button onClick={()=>markSold(b.batchId)}>
      Mark as Sold
    </button>

    <button onClick={()=>markDamaged(b.batchId)}>
      Mark as Damaged
    </button>

  </div>
)}

</div>

))}

</div>

  </div>
</div>

)
}