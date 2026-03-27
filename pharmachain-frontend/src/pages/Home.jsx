export default function Home(){

return(

<div className="home">

{/* HERO */}
<div className="hero">
  <div className="hero-content">
    <h1>PharmaChain</h1>
    <p>
      Ensuring Authentic Medicines using Blockchain Technology
    </p>

    <div className="cta-buttons">
      <a href="/login" className="btn primary">Get Started</a>
      <a href="/verify" className="btn secondary">Verify Medicine</a>
    </div>
  </div>
</div>

{/* ABOUT */}
<div className="section">
  <h2>Why PharmaChain?</h2>
  <p className="center-text">
    Counterfeit medicines are a global threat. PharmaChain ensures
    complete transparency and trust in the pharmaceutical supply chain
    using blockchain technology.
  </p>
</div>

{/* HOW IT WORKS */}
<div className="section dark">

<h2>How It Works</h2>

<div className="steps">

<div className="step">🧪 Manufacturer creates batch</div>
<div className="step">🚚 Transfer through supply chain</div>
<div className="step">🏥 Pharmacy verifies medicine</div>
<div className="step">📱 Consumer scans QR</div>

</div>

</div>

{/* FEATURES */}
<div className="section">

<h2>Key Features</h2>

<div className="dashboard">

<div className="box">
<h3>Blockchain Security</h3>
<p>Immutable and tamper-proof drug records</p>
</div>

<div className="box">
<h3>Supply Chain Tracking</h3>
<p>Track every stage from manufacturer to consumer</p>
</div>

<div className="box">
<h3>QR Verification</h3>
<p>Instant verification using QR scanning</p>
</div>

<div className="box">
<h3>Trust Score</h3>
<p>Evaluate authenticity with intelligent scoring</p>
</div>

</div>

</div>

{/* PORTAL ACCESS */}
<div className="section dark">

<h2>Access Portal</h2>

<div className="dashboard">

<div className="box">
<h3>Stakeholder Login</h3>
<a href="/login">Login →</a>
</div>

<div className="box">
<h3>Register Company</h3>
<a href="/register">Register →</a>
</div>

<div className="box">
<h3>Verify Medicine</h3>
<a href="/verify">Verify →</a>
</div>

<div className="box">
<h3>Admin Dashboard</h3>
<a href="/admin">Open →</a>
</div>

</div>

</div>

{/* FOOTER */}
<div className="footer">

<p>© 2026 PharmaChain | Secure Healthcare with Blockchain</p>

</div>

</div>

)

}