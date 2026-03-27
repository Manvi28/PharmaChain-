import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";
import { getBatches } from "../utils/batchStorage";
import "../styles/pharmacy.css";

export default function Pharmacy(){

const [batchId,setBatchId]=useState("");
const [data,setData]=useState(null);
const [history,setHistory]=useState([]);
const [status,setStatus]=useState("");

// 🔍 FETCH + VERIFY
async function fetchBatch(){

try{

const provider=new ethers.BrowserProvider(window.ethereum);
const contract=await getContract(provider);

const result=await contract.getBatch(batchId);

setData(result);

// 🔥 GET LOCAL HISTORY
const batches = getBatches();

const localBatch = batches.find(b => b.batchId === batchId);

if(localBatch){
  setHistory(localBatch.history);

  // ✅ AUTHENTICITY CHECK
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

<div className="card">

<h2>Verify Drug Batch</h2>

<input placeholder="Batch ID"
onChange={e=>setBatchId(e.target.value)}
/>

<button onClick={fetchBatch}>
Verify
</button>

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

{/* SUPPLY CHAIN HISTORY */}
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

{/* AUTHENTICITY STATUS */}
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

</div>

</div>
</div>
)

}