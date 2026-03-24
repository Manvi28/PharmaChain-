import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";
import { getBatches } from "../utils/batchStorage";

export default function Verify(){

const [batchId,setBatchId] = useState("");
const [data,setData] = useState(null);
const [history,setHistory] = useState([]);
const [trustScore,setTrustScore] = useState(0);
const [status,setStatus] = useState("");

// 🔍 FETCH DATA
async function fetchBatch(id){

const provider = new ethers.BrowserProvider(window.ethereum);
const contract = await getContract(provider);

const result = await contract.getBatch(id);

setData(result);

// 🔥 LOCAL STORAGE HISTORY
const batches = getBatches();
const localBatch = batches.find(b => b.batchId === id);

if(localBatch){

setHistory(localBatch.history);

// 🧠 TRUST SCORE CALCULATION
let score = 50;

if(localBatch.history.length >= 1) score += 20;
if(localBatch.history.length >= 2) score += 20;
if(localBatch.history.length >= 3) score += 10;

setTrustScore(score);

// STATUS
if(score >= 80){
  setStatus("authentic");
}else{
  setStatus("suspicious");
}

}else{
setHistory([]);
setStatus("not_found");
setTrustScore(0);
}

}

// 📷 QR SCANNER
useEffect(()=>{

const scanner = new Html5QrcodeScanner(
"reader",
{fps:10,qrbox:250}
);

scanner.render(

(decodedText)=>{

const parts = decodedText.split("batchId=");

if(parts.length>1){

const id = parts[1];

setBatchId(id);

fetchBatch(id);

}

scanner.clear();

},

(error)=>{}

);

},[]);

return(

<div className="container">

<div className="card">

<h2>Scan Medicine QR</h2>

<div id="reader"></div>

{batchId && (
<p><b>Batch ID:</b> {batchId}</p>
)}

{/* BLOCKCHAIN DETAILS */}
{data && (

<div style={{marginTop:"20px"}}>

<h3>Medicine Details</h3>

<p><b>Name:</b> {data.medicineName}</p>
<p><b>Location:</b> {data.location}</p>
<p><b>Expiry:</b> {data.expiryDate.toString()}</p>
<p><b>Current Owner:</b> {data.currentOwner}</p>

</div>

)}

{/* SUPPLY CHAIN */}
{history.length > 0 && (

<div style={{marginTop:"20px"}}>

<h3>Supply Chain</h3>

{history.map((h,i)=>(
<p key={i}>
{h.step} → {h.owner}
</p>
))}

</div>

)}

{/* TRUST SCORE */}
{trustScore > 0 && (

<div style={{marginTop:"20px"}}>

<h3>Trust Score</h3>

<p style={{fontSize:"20px"}}>
{trustScore}/100
</p>

</div>

)}

{/* STATUS */}
{status && (

<div style={{marginTop:"20px"}}>

<h3>Verification Result</h3>

{status === "authentic" && (
<p style={{color:"green", fontWeight:"bold"}}>
✔ Authentic Medicine
</p>
)}

{status === "suspicious" && (
<p style={{color:"orange", fontWeight:"bold"}}>
⚠ Suspicious Product
</p>
)}

{status === "not_found" && (
<p style={{color:"red", fontWeight:"bold"}}>
❌ No Record Found
</p>
)}

</div>

)}

</div>

</div>

)
}