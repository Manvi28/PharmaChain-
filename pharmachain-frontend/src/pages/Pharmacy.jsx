import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";

export default function Pharmacy(){

const [batchId,setBatchId]=useState("");
const [data,setData]=useState(null);

async function fetchBatch(){

const provider=new ethers.BrowserProvider(window.ethereum);
const contract=await getContract(provider);

const result=await contract.getBatch(batchId);

setData(result);

}

return(

<div className="container">

<div className="card">

<h2>Verify Drug Batch</h2>

<input placeholder="Batch ID"
onChange={e=>setBatchId(e.target.value)}
/>

<button onClick={fetchBatch}>
Verify
</button>

{data &&(

<div style={{marginTop:"20px"}}>

<p>Medicine: {data.medicineName}</p>
<p>Location: {data.location}</p>
<p>Expiry: {data.expiryDate.toString()}</p>
<p>Owner: {data.currentOwner}</p>

</div>

)}

</div>

</div>

)

}