import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";

export default function Verify(){

const [batchId,setBatchId] = useState("");
const [data,setData] = useState(null);

async function fetchBatch(id){

const provider = new ethers.BrowserProvider(window.ethereum);

const contract = await getContract(provider);

const result = await contract.getBatch(id);

setData(result);

}

useEffect(()=>{

const scanner = new Html5QrcodeScanner(
"reader",
{fps:10,qrbox:250}
);

scanner.render(

(decodedText)=>{

// decodedText = http://localhost:5173/verify?batchId=PCM001

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

<p>Batch ID: {batchId}</p>

)}

{data && (

<div style={{marginTop:"20px"}}>

<h3>Medicine Details</h3>

<p><b>Name:</b> {data.medicineName}</p>

<p><b>Location:</b> {data.location}</p>

<p><b>Expiry:</b> {data.expiryDate.toString()}</p>

<p><b>Current Owner:</b> {data.currentOwner}</p>

<p><b>Status:</b> {data.status.toString()}</p>

</div>

)}

</div>

</div>

)

}