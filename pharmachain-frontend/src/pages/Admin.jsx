import { getUsers, approveUser } from "../utils/auth";
import { useState } from "react";

export default function Admin(){

const [users,setUsers]=useState(getUsers());

function approve(address){
  approveUser(address);
  setUsers(getUsers());
}

return(

<div className="container">

<h2>Admin Dashboard</h2>

{users.map(u=>(
<div className="card" key={u.address}>

<p><b>{u.name}</b></p>
<p>{u.role}</p>
<p>{u.address}</p>

{u.approved ? (
<p>Approved</p>
) : (
<button onClick={()=>approve(u.address)}>
Approve
</button>
)}

</div>
))}

</div>

)

}