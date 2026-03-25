import { useState, useEffect } from "react";
import { connectWallet } from "../utils/web3";
import { getContract } from "../utils/contract";
import { QRCodeCanvas } from "qrcode.react";

import { saveBatch, getBatches, updateBatchHistory } from "../utils/batchStorage";

export default function Manufacturer(){

  const [batchId,setBatchId]=useState("");
  const [medicine,setMedicine]=useState("");
  const [expiry,setExpiry]=useState("");
  const [location,setLocation]=useState("");
  const [qr,setQr]=useState("");

  const [batches,setBatches]=useState([]);
  const [transferId,setTransferId]=useState("");
  const [distributor,setDistributor]=useState("");

  const [address,setAddress]=useState("");

  // 🔐 GET WALLET ADDRESS
  useEffect(()=>{
    async function load(){
      const signer = await connectWallet();
      const addr = await signer.getAddress();
      setAddress(addr);
    }
    load();

    setBatches(getBatches());
  },[]);

  // ✅ CREATE BATCH
  async function createBatch(){

    if(!batchId || !medicine || !expiry || !location){
      alert("All fields required");
      return;
    }

    try{
      const signer = await connectWallet();
      const addr = await signer.getAddress();

      const contract = await getContract(signer);

      await contract.createBatch(
        batchId,
        medicine,
        expiry,
        location
      );

      // SAVE LOCALLY
      saveBatch({
        batchId,
        medicine,
        expiry,
        location,
        owner: addr,
        history: [
          {
            step: "Manufactured",
            owner: addr
          }
        ]
      });

      setBatches(getBatches());

      // ✅ FIXED QR LINK
      const link = `${window.location.origin}/verify?batchId=${batchId}`;
      setQr(link);

      alert("Batch Created Successfully");

    }catch(err){
      console.log(err);
      alert("Error creating batch");
    }
  }

  // ✅ TRANSFER OWNERSHIP
  async function transferOwnership(){

    if(!transferId || !distributor){
      alert("Enter batch ID and distributor address");
      return;
    }

    try{
      const signer = await connectWallet();
      const contract = await getContract(signer);

      await contract.transferOwnership(transferId, distributor);

      // UPDATE LOCAL STORAGE
      updateBatchHistory(transferId, distributor);

      setBatches(getBatches());

      alert("Ownership Transferred");

    }catch(err){
      console.log(err);
      alert("Transfer failed");
    }
  }

  return(

    <div className="container">

      {/* CREATE BATCH */}
      <div className="card">

        <h2>Create Drug Batch</h2>

        <input
          placeholder="Batch ID"
          onChange={e=>setBatchId(e.target.value)}
        />

        <input
          placeholder="Medicine Name"
          onChange={e=>setMedicine(e.target.value)}
        />

        {/* ✅ DATE INPUT FIX */}
        <input
          type="date"
          onChange={e=>{
            const timestamp = Math.floor(new Date(e.target.value).getTime()/1000);
            setExpiry(timestamp);
          }}
        />

        <input
          placeholder="Manufacturing Location"
          onChange={e=>setLocation(e.target.value)}
        />

        <button onClick={createBatch}>
          Create Batch
        </button>

        {qr &&(
          <div style={{marginTop:"20px"}}>
            <h3>QR Code</h3>
            <QRCodeCanvas value={qr} size={200}/>
            <p style={{fontSize:"12px"}}>{qr}</p>
          </div>
        )}

      </div>

      {/* TRANSFER */}
      <div className="card">

        <h3>Transfer to Distributor</h3>

        <input
          placeholder="Batch ID"
          onChange={e=>setTransferId(e.target.value)}
        />

        <input
          placeholder="Distributor Wallet Address"
          onChange={e=>setDistributor(e.target.value)}
        />

        <button onClick={transferOwnership}>
          Transfer Ownership
        </button>

      </div>

      {/* VIEW BATCHES */}
      <div className="card">

        <h3>Your Batches</h3>

        {batches.length === 0 && <p>No batches created yet</p>}

        {batches.map(b=>(

          <div key={b.batchId} style={{borderBottom:"1px solid #ddd",padding:"10px"}}>

            <p><b>{b.batchId}</b></p>
            <p>Medicine: {b.medicine}</p>
            <p>Location: {b.location}</p>
            <p>Owner: {b.owner}</p>

            <p>
              Status: {b.owner === address 
                ? "You own this batch" 
                : "Transferred"}
            </p>

          </div>

        ))}

      </div>

    </div>

  )
}