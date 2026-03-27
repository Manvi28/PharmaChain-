import { useState } from "react";
import { connectWallet } from "../utils/web3"; 
import { saveUser } from "../utils/auth";
export default function Register() {

  const [role, setRole] = useState("manufacturer");

  const [formData, setFormData] = useState({
    companyName: "",
    licenseNumber: "",
    location: ""
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  async function register() {

    if (!formData.companyName || !formData.licenseNumber || !formData.location) {
      alert("Please fill all fields");
      return;
    }

    if (formData.licenseNumber.length < 5) {
      alert("Invalid License Number");
      return;
    }

    const signer = await connectWallet();
    const address = await signer.getAddress();

    saveUser({
      address,
      role,
      companyName: formData.companyName,
      licenseNumber: formData.licenseNumber,
      location: formData.location,
      status: "Pending"
    });

    alert("Registered. Waiting for admin approval.");
  }

  return (
    <div className="register-page">

      <div className="glass-card">

        <h2>Register Your Organization</h2>
        <p className="subtitle">Join the PharmaChain network securely</p>

        {/* ROLE */}
        <select
          className="input"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="manufacturer">Manufacturer</option>
          <option value="distributor">Distributor</option>
          <option value="pharmacy">Pharmacy</option>
        </select>

        {/* MANUFACTURER */}
        {role === "manufacturer" && (
          <>
            <input className="input" placeholder="Company Name"
              onChange={e => handleChange("companyName", e.target.value)} />

            <input className="input" placeholder="Drug License Number"
              onChange={e => handleChange("licenseNumber", e.target.value)} />

            <input className="input" placeholder="Manufacturing Location"
              onChange={e => handleChange("location", e.target.value)} />
          </>
        )}

        {/* DISTRIBUTOR */}
        {role === "distributor" && (
          <>
            <input className="input" placeholder="Company Name"
              onChange={e => handleChange("companyName", e.target.value)} />

            <input className="input" placeholder="Transport License / Business ID"
              onChange={e => handleChange("licenseNumber", e.target.value)} />

            <input className="input" placeholder="Operating Region"
              onChange={e => handleChange("location", e.target.value)} />
          </>
        )}

        {/* PHARMACY */}
        {role === "pharmacy" && (
          <>
            <input className="input" placeholder="Pharmacy Name"
              onChange={e => handleChange("companyName", e.target.value)} />

            <input className="input" placeholder="Pharmacy License Number"
              onChange={e => handleChange("licenseNumber", e.target.value)} />

            <input className="input" placeholder="Address"
              onChange={e => handleChange("location", e.target.value)} />
          </>
        )}

        <button className="submit-btn" onClick={register}>
          Register & Connect Wallet
        </button>

      </div>

    </div>
  );
}