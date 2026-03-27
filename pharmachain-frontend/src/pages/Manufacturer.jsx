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

  const [batches,setBatches]=useState([]);
  const [transferId,setTransferId]=useState("");
  const [distributor,setDistributor]=useState("");
  const [selectedDistributor,setSelectedDistributor]=useState("");

  const [address,setAddress]=useState("");

  const distributors = [
    { name: "Apollo Distributor", address: "0x123..." },
    { name: "MedPlus Distributor", address: "0x456..." }
  ];

  useEffect(()=>{
    async function load(){
      const signer = await connectWallet();
      const addr = await signer.getAddress();
      setAddress(addr);
    }
    load();

    setBatches(getBatches());
  },[]);

  async function createBatch(){

    if(!batchId || !medicine || !expiry || !location){
      alert("All fields required");
      return;
    }

    try{
      const signer = await connectWallet();
      const addr = await signer.getAddress();
      const contract = await getContract(signer);

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

        {/* CREATE BATCH */}
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

        {/* BATCH LIST + VIEW ONLY REVIEWS */}
        <div className="manufacturer-card">

          <h3>Your Batches</h3>

          {batches.map(b=>(
            <div key={b.batchId} className="batch-item">

              <p><b>{b.batchId}</b></p>
              <p>{b.medicine}</p>
              <p>{b.location}</p>
              <p>Status: {b.owner === address ? "Owned" : "Transferred"}</p>

              {/* VIEW ONLY */}
              <ReviewSection batchId={b.batchId} readOnly={true} />

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}