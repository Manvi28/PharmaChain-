import { getUsers, updateStatus } from "../utils/auth";
import { useState } from "react";

export default function Admin(){

const [users,setUsers]=useState(getUsers());

// 🔐 login states
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [isLoggedIn,setIsLoggedIn]=useState(false);

// 🔐 login function
function login(){
  if(email === "admin@gmail.com" && password === "Admin@Hackathon2026!"){
    setIsLoggedIn(true);
  } else {
    alert("Invalid credentials");
  }
}

// ✅ approve
function approve(address){
  updateStatus(address,"approved");
  setUsers(getUsers());
}

// ❌ reject
function reject(address){
  updateStatus(address,"rejected");
  setUsers(getUsers());
}

// 🔒 login UI
if(!isLoggedIn){
  return(
    <div className="container">
      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Enter Gmail"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  )
}

return(

<div className="container">

<h2>Admin Dashboard</h2>

{users.map(u=>{

// 🧠 handle old + new system
const status = u.status || (u.approved ? "approved" : "pending");

return(

<div className="card" key={u.address}>

<p><b>{u.name}</b></p>
<p>Role: {u.role}</p>
<p>Address: {u.address}</p>

<p>
Status: 
{status === "pending" && " Pending"}
{status === "approved" && " Approved"}
{status === "rejected" && " Rejected"}
</p>

{status === "pending" && (
<div style={{display:"flex", gap:"10px"}}>

<button onClick={()=>approve(u.address)}>
Approve
</button>

<button
style={{background:"red"}}
onClick={()=>reject(u.address)}
>
Reject
</button>

</div>
)}

</div>

)})}

</div>

)

}