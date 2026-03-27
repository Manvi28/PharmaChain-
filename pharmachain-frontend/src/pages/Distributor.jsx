import { useState, useEffect } from "react";
import { connectWallet } from "../utils/web3";
import { getContract } from "../utils/contract";
import { getBatches, updateBatchHistory, rejectBatch } from "../utils/batchStorage";
import { ethers } from "ethers";
import "../styles/distributor.css";

export default function Distributor(){

const [batchId,setBatchId]=useState("");
const [owner,setOwner]=useState("");

// EXISTING STATES
const [batches,setBatches]=useState([]);
const [viewBatch,setViewBatch]=useState(null);

// STATES
const [rejectReasons,setRejectReasons]=useState({});
const [proofFiles,setProofFiles]=useState({});

// LOAD LOCAL STORAGE
useEffect(()=>{
  setBatches(getBatches());
},[]);

// VIEW
async function fetchBatch(){

const provider = new ethers.BrowserProvider(window.ethereum);
const contract = await getContract(provider);

const result = await contract.getBatch(batchId);

setViewBatch(result);

}

// 🔄 TRANSFER (ONLY ADDITION DONE HERE)
async function transfer(){

const signer=await connectWallet();
const address = await signer.getAddress();

const contract=await getContract(signer);

// 🔥 NEW CHECK: BLOCK IF REJECTED
const localBatch = batches.find(
  b => String(b.batchId) === String(batchId)
);

if(localBatch && localBatch.status === "Rejected"){
  alert("This batch is rejected. Transfer not allowed.");
  return;
}

// EXISTING LOGIC (UNCHANGED)
const batch = await contract.getBatch(batchId);

if(batch.currentOwner.toLowerCase() !== address.toLowerCase()){
  alert("You are not the current owner");
  return;
}

await contract.transferOwnership(batchId,owner);

updateBatchHistory(batchId, owner);

setBatches(getBatches());

alert("Ownership transferred");

}

// REJECT FUNCTION
function handleReject(id){

const reason = rejectReasons[id];
const proof = proofFiles[id];

if(!reason){
  alert("Enter rejection reason");
  return;
}

if(!proof){
  alert("Attach proof file");
  return;
}

rejectBatch(id, {
  reason: reason,
  proof: proof
});

setRejectReasons({
  ...rejectReasons,
  [id]: ""
});

setProofFiles({
  ...proofFiles,
  [id]: null
});

setBatches(getBatches());

}

return(

<div className="distributor-page">
  <div className="distributor-grid">

{/* TRANSFER */}
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

{/* VIEW */}
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

{/* BATCHES */}
<div className="distributor-card">

<h3>Available Batches (Local)</h3>

{batches.length === 0 && <p>No batches found</p>}

{batches.map(b=>(
<div key={b.batchId} className="batch-item">

<p><b>{b.batchId}</b></p>
<p>Medicine: {b.medicine}</p>
<p>Owner: {b.owner}</p>

{/* IF REJECTED */}
{b.status === "Rejected" ? (
  <div style={{marginTop:"10px"}}>
    <button disabled style={{background:"gray"}}>
      Rejected
    </button>
    <p style={{color:"green"}}>
      Rejection message sent to manufacturer
    </p>
  </div>
) : (

  <div style={{marginTop:"10px"}}>

    <input
      type="text"
      placeholder="Reason for rejection"
      value={rejectReasons[b.batchId] || ""}
      onChange={(e)=>setRejectReasons({
        ...rejectReasons,
        [b.batchId]: e.target.value
      })}
    />

    <input
      type="file"
      accept="image/*"
      onChange={(e)=>{
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();

        reader.onload = (event)=>{
          setProofFiles({
            ...proofFiles,
            [b.batchId]: event.target.result
          });
        };

        reader.readAsDataURL(file);
      }}
    />

    <button onClick={()=>handleReject(b.batchId)}>
      Reject Batch
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