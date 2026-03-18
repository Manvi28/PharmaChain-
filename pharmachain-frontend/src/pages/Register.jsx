import { useState } from "react";
import { connectWallet } from "../utils/web3";
import { saveUser } from "../utils/auth";

export default function Register(){

const [name,setName]=useState("");
const [role,setRole]=useState("manufacturer");
const [license,setLicense]=useState("");

async function register(){

const signer = await connectWallet();
const address = await signer.getAddress();

saveUser({
  address,
  name,
  role,
  license,
  approved:false
});

alert("Registered. Waiting for admin approval.");

}

return(

<div className="container">
<div className="card">

<h2>Register</h2>

<input
placeholder="Company Name"
onChange={e=>setName(e.target.value)}
/>

<select onChange={e=>setRole(e.target.value)}>
<option value="manufacturer">Manufacturer</option>
<option value="distributor">Distributor</option>
<option value="pharmacy">Pharmacy</option>
</select>

<input
placeholder="License Number"
onChange={e=>setLicense(e.target.value)}
/>

<button onClick={register}>
Submit
</button>

</div>
</div>

)

}