import { connectWallet } from "../utils/web3";
import { getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login(){

const navigate = useNavigate();

async function login(){

const signer = await connectWallet();
const address = await signer.getAddress();

const user = getUser(address);

if(!user){
  navigate("/register");
  return;
}

if(!user.approved){
  alert("Waiting for admin approval");
  return;
}

// redirect based on role
if(user.role === "manufacturer") navigate("/manufacturer");
if(user.role === "distributor") navigate("/distributor");
if(user.role === "pharmacy") navigate("/pharmacy");

}

return(

<div className="container">
<div className="card">

<h2>Login</h2>

<button onClick={login}>
Connect Wallet
</button>

</div>
</div>

)

}