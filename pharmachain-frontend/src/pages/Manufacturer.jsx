import { useState, useEffect } from "react";
import { connectWallet } from "../utils/web3";
import { getContract } from "../utils/contract";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/manufacturer.css";
import { saveBatch, getBatches, updateBatchHistory } from "../utils/batchStorage";
import ReviewSection from "../components/ReviewSection";

export default function Manufacturer(){

  const [batchId,setBatchId]=useState("");
  const [medicine,setMedicine]=useState("");
  const [expiry,setExpiry]=useState("");
  const [location,setLocation]=useState("");
  const [qr,setQr]=useState("");
  const [recallId, setRecallId] = useState("");
  const [batches,setBatches]=useState([]);
  const [transferId,setTransferId]=useState("");
  const [distributor,setDistributor]=useState("");
  const [selectedDistributor,setSelectedDistributor]=useState("");
  const [address,setAddress]=useState("");

  const distributors = [
    { name: "Apollo Distributor", address: "0x123..." },
    { name: "MedPlus Distributor", address: "0x456..." }
  ];

  // 🔥 LOAD + AUTO REFRESH
  useEffect(()=>{
    async function load(){
      const signer = await connectWallet();
      const addr = await signer.getAddress();
      setAddress(addr);
    }
    load();

    setBatches(getBatches());

    // ✅ AUTO SYNC (IMPORTANT)
    const interval = setInterval(()=>{
      setBatches(getBatches());
    },2000);

    return () => clearInterval(interval);

  },[]);

  async function recallBatch(){

    if(!recallId){
      alert("Enter Batch ID");
      return;
    }

    try{
      const signer = await connectWallet();
      const contract = await getContract(signer);

      await contract.recallBatch(recallId);

      alert("Batch Recalled Successfully");

    }catch(err){
      console.log(err);
      alert("Recall failed");
    }
  }

  async function createBatch(){

    if(!batchId || !medicine || !expiry || !location){
      alert("All fields required");
      return;
    }

    try{
      const signer = await connectWallet();
      const addr = await signer.getAddress();
      const contract = await getContract(signer);

      const existing = getBatches().find(
        b => String(b.batchId) === String(batchId)
      );

      if(existing){
        alert("Batch ID already exists");
        return;
      }

      await contract.createBatch(batchId, medicine, expiry, location);

      saveBatch({
        batchId,
        medicine,
        expiry,
        location,
        owner: addr,
        history: [
          { step: "Manufactured", owner: addr }
        ]
      });

      setBatches(getBatches());

      const link = `${window.location.origin}/verify?batchId=${batchId}`;
      setQr(link);

      alert("Batch Created Successfully");

    }catch(err){
      console.log(err);
      alert("Error creating batch");
    }
  }

  async function transferOwnership(){

    const finalDistributor = selectedDistributor || distributor;

    if(!transferId || !finalDistributor){
      alert("Enter batch ID and select distributor");
      return;
    }

    const confirm = window.confirm(
      `Transfer batch ${transferId} to ${finalDistributor}?`
    );

    if(!confirm) return;

    try{
      const signer = await connectWallet();
      const contract = await getContract(signer);

      await contract.transferOwnership(transferId, finalDistributor);

      updateBatchHistory(transferId, finalDistributor);

      setBatches(getBatches());

      alert("Ownership Transferred");

    }catch(err){
      console.log(err);
      alert("Transfer failed");
    }
  }

  function downloadQR(){
    const canvas = document.querySelector(".qr-section canvas");

    if(!canvas){
      alert("QR not generated yet");
      return;
    }

    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = url;
    link.download = `batch-${batchId}.png`;
    link.click();
  }

  return(

    <div className="manufacturer-page">
      <div className="manufacturer-grid">

        {/* CREATE */}
        <div className="manufacturer-card">

          <h2>Create Drug Batch</h2>

          <input placeholder="Batch ID" onChange={e=>setBatchId(e.target.value)} />
          <input placeholder="Medicine Name" onChange={e=>setMedicine(e.target.value)} />

          <input
            type="date"
            onChange={e=>{
              const timestamp = Math.floor(new Date(e.target.value).getTime()/1000);
              setExpiry(timestamp);
            }}
          />

          <input placeholder="Location" onChange={e=>setLocation(e.target.value)} />

          <button onClick={createBatch}>Create Batch</button>

          <div className="qr-section">
            {qr && (
              <div>
                <QRCodeCanvas value={qr} size={200}/>
                <button onClick={downloadQR}>Download QR</button>
              </div>
            )}
          </div>

        </div>

        {/* TRANSFER */}
        <div className="manufacturer-card">

          <h3>Transfer Ownership</h3>

          <input placeholder="Batch ID" onChange={e=>setTransferId(e.target.value)} />

          <select
            value={selectedDistributor}
            onChange={(e)=>setSelectedDistributor(e.target.value)}
          >
            <option value="">Select Distributor</option>
            {distributors.map((d,i)=>(
              <option key={i} value={d.address}>{d.name}</option>
            ))}
          </select>

          <input
            placeholder="Or Enter Wallet Address"
            onChange={e=>setDistributor(e.target.value)}
          />

          <button onClick={transferOwnership}>Transfer</button>

        </div>

        {/* RECALL */}
        <div className="manufacturer-card">

          <h3>Recall Batch</h3>

          <input
            placeholder="Batch ID"
            onChange={e=>setRecallId(e.target.value)}
          />

          <button onClick={recallBatch}>
            Recall Batch
          </button>

        </div>

        {/* LIST */}
        <div className="manufacturer-card">

          <h3>Your Batches</h3>

          {batches.map(b=>(

            <div 
              key={b.batchId} 
              className={`batch-item 
                ${b.status === "damaged" ? "batch-damaged" : ""}
                ${b.status === "sold" ? "batch-sold" : ""}
                ${b.status === "accepted" ? "batch-accepted" : ""}
              `}
            >

              <p><b>{b.batchId}</b></p>
              <p>{b.medicine}</p>
              <p>{b.location}</p>

              {/* ✅ FINAL STATUS */}
              <p>
                Status: {
                  b.status === "damaged" ? "❌ Damaged" :
                  b.status === "sold" ? "✔ Sold" :
                  b.status === "accepted" ? "✔ Accepted by Distributor" :
                  b.status === "Rejected" ? "❌ Rejected" :
                  b.status === "recalled" ? "🚨 Recalled" :
                  b.owner === address ? "Owned" :
                  "Transferred"
                }
              </p>

              {/* REJECTION */}
              {b.status === "Rejected" && (
                <div style={{
                  marginTop: "10px",
                  padding: "10px",
                  border: "1px solid red",
                  borderRadius: "6px",
                  background: "#ffe6e6"
                }}>
                  <p style={{color:"red"}}>
                    <b>❌ Batch Rejected by Distributor</b>
                  </p>

                  <p><b>Reason:</b> {b.rejectionReason}</p>

                  <p><b>Proof:</b></p>

                  {b.proof ? (
                    b.proof.startsWith("data:image") ? (
                      <img
                        src={b.proof}
                        alt="proof"
                        style={{
                          width: "200px",
                          marginTop: "5px",
                          borderRadius: "6px",
                          border: "1px solid #ccc"
                        }}
                      />
                    ) : (
                      <p style={{color:"red"}}>
                        ⚠️ Image not stored correctly
                      </p>
                    )
                  ) : (
                    <p>No proof available</p>
                  )}

                  <p style={{fontSize:"12px", color:"gray"}}>
                    Rejection message received from distributor
                  </p>
                </div>
              )}

              <ReviewSection batchId={b.batchId} readOnly={true} />

            </div>

          ))}

        </div>

      </div>
    </div>
  )
}