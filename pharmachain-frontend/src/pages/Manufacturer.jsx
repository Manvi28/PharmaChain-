import { useState } from "react";
import { connectWallet } from "../utils/web3";
import { getContract } from "../utils/contract";
import { QRCodeCanvas } from "qrcode.react";

export default function Manufacturer(){

const [batchId,setBatchId]=useState("");
const [medicine,setMedicine]=useState("");
const [expiry,setExpiry]=useState("");
const [location,setLocation]=useState("");
const [qr,setQr]=useState("");

async function createBatch(){

const signer=await connectWallet();
const contract=await getContract(signer);

await contract.createBatch(
batchId,
medicine,
expiry,
location
);

const link=`http://localhost:5173/verify?batchId=${batchId}`;

setQr(link);

}

return(

<div className="container">

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

</div>

)

}