import { BrowserRouter,Routes,Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Manufacturer from "./pages/Manufacturer";
import Distributor from "./pages/Distributor";
import Pharmacy from "./pages/Pharmacy";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

function App(){

return(

<BrowserRouter>

<Navbar/>

<Routes>

<Route path="/" element={<Home/>}/>
<Route path="/manufacturer" element={<Manufacturer/>}/>
<Route path="/distributor" element={<Distributor/>}/>
<Route path="/pharmacy" element={<Pharmacy/>}/>
<Route path="/verify" element={<Verify/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/register" element={<Register/>}/>
<Route path="/admin" element={<Admin/>}/>

</Routes>

</BrowserRouter>

)

}

export default App;