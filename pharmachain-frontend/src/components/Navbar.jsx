import { Link } from "react-router-dom";

export default function Navbar(){

return(

<div className="navbar">

<h2>PharmaChain</h2>

<div>

<Link to="/">Home</Link>
<Link to="/manufacturer">Manufacturer</Link>
<Link to="/distributor">Distributor</Link>
<Link to="/pharmacy">Pharmacy</Link>
<Link to="/verify">Verify</Link>

</div>

</div>

)

}