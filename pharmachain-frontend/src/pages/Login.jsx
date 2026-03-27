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

if(user.status === "pending"){
  alert("Waiting for admin approval");
  return;
}

if(user.status === "rejected"){
  alert("Your registration was rejected");
  return;
}

if(user.role === "manufacturer") navigate("/manufacturer");
if(user.role === "distributor") navigate("/distributor");
if(user.role === "pharmacy") navigate("/pharmacy");

}

return(

<div className="login-page">

  <div className="glass-card">

    <h2>Welcome Back</h2>
    <p className="subtitle">
      Connect your wallet to access PharmaChain dashboard
    </p>

    <button className="wallet-btn" onClick={login}>
      🔐 Connect Wallet
    </button>

    <p className="helper-text">
      New user? <span onClick={()=>navigate("/register")}>Register here</span>
    </p>

  </div>

</div>

)

}