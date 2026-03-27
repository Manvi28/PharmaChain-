import { Link } from "react-router-dom";

export default function Navbar(){

return(

<nav className="navbar">

{/* LOGO */}
<div className="nav-left">
  <Link to="/" className="logo">
    PharmaChain
  </Link>
</div>

{/* MENU */}
<div className="nav-right">

  <Link to="/" className="nav-link">Home</Link>
  <Link to="/register" className="nav-link">Register</Link>
  <Link to="/login" className="nav-link">Login</Link>

  {/* CTA BUTTON */}
  <Link to="/verify" className="nav-btn">
    Verify Medicine
  </Link>

</div>

</nav>

)

}