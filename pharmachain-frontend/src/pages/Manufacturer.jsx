import { useState, useEffect } from "react";
import { connectWallet } from "../utils/web3";
import { getContract } from "../utils/contract";
import { QRCodeCanvas } from "qrcode.react";

// ✅ IMPORT STORAGE UTILS
import { saveBatch, getBatches, updateBatchHistory } from "../utils/batchStorage";

export default function Manufacturer(){

const [batchId,setBatchId]=useState("");
const [medicine,setMedicine]=useState("");
const [expiry,setExpiry]=useState("");
const [location,setLocation]=useState("");
const [qr,setQr]=useState("");

// NEW STATES
const [batches,setBatches]=useState([]);
const [transferId,setTransferId]=useState("");
const [distributor,setDistributor]=useState("");

// ✅ LOAD BATCHES FROM STORAGE
useEffect(()=>{
  setBatches(getBatches());
},[]);

// ✅ CREATE BATCH (UNCHANGED CORE LOGIC + STORAGE ADDED)
async function createBatch(){

const signer = await connectWallet();
const address = await signer.getAddress();

const contract = await getContract(signer);

await contract.createBatch(
batchId,
medicine,
expiry,
location
);

// ✅ SAVE USING batchStorage.js
saveBatch({
  batchId,
  medicine,
  expiry,
  location,
  owner: address
});

// refresh UI
setBatches(getBatches());

const link=`http://localhost:5173/verify?batchId=${batchId}`;

setQr(link);

alert("Batch Created");

}

// ✅ TRANSFER OWNERSHIP (BLOCKCHAIN + STORAGE SYNC)
async function transferOwnership(){

const signer = await connectWallet();
const contract = await getContract(signer);

await contract.transferOwnership(transferId, distributor);

// ✅ UPDATE HISTORY USING batchStorage
updateBatchHistory(transferId, distributor);

// refresh UI
setBatches(getBatches());

alert("Ownership Transferred");

}

return(

<div className="container">

{/* CREATE BATCH */}
<div className="card">

<h2>Create Drug Batch</h2>

<input placeholder="Batch ID"
onChange={e=>setBatchId(e.target.value)}
/>

<input placeholder="Medicine Name"
onChange={e=>setMedicine(e.target.value)}
/>

<input placeholder="Expiry Timestamp"
onChange={e=>setExpiry(e.target.value)}
/>

<input placeholder="Location"
onChange={e=>setLocation(e.target.value)}
/>

<button onClick={createBatch}>
Create Batch
</button>

{qr &&(

<div style={{marginTop:"20px"}}>

<h3>QR Code</h3>

<QRCodeCanvas value={qr} size={200}/>

</div>

)}

</div>

{/* TRANSFER */}
<div className="card">

<h3>Transfer to Distributor</h3>

<input
placeholder="Batch ID"
onChange={e=>setTransferId(e.target.value)}
/>

<input
placeholder="Distributor Address"
onChange={e=>setDistributor(e.target.value)}
/>

<button onClick={transferOwnership}>
Transfer Ownership
</button>

</div>

{/* VIEW BATCHES */}
<div className="card">

<h3>Your Batches</h3>

{batches.length === 0 && <p>No batches created yet</p>}

{batches.map(b=>(
<div key={b.batchId} style={{borderBottom:"1px solid #ddd",padding:"10px"}}>

<p><b>{b.batchId}</b></p>
<p>Medicine: {b.medicine}</p>
<p>Owner: {b.owner}</p>

</div>
))}

</div>

</div>

)

}