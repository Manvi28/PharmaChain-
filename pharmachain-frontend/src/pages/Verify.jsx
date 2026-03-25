import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";
import { getBatches } from "../utils/batchStorage";

export default function Verify(){

  const [batchId,setBatchId] = useState("");
  const [data,setData] = useState(null);
  const [history,setHistory] = useState([]);
  const [trustScore,setTrustScore] = useState(0);
  const [status,setStatus] = useState("");
  const [error,setError] = useState("");

  // 🔍 FETCH DATA
  async function fetchBatch(id){

    if(!id){
      alert("Enter Batch ID");
      return;
    }

    try{
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = await getContract(provider);

      const result = await contract.getBatch(id);

      setData(result);
      setError("");

      const batches = getBatches();
      const localBatch = batches.find(b => b.batchId === id);

      if(localBatch){

        setHistory(localBatch.history);

        // 🧠 TRUST SCORE
        let score = 40;

        if(localBatch.history.length >= 1) score += 20;
        if(localBatch.history.length >= 2) score += 20;
        if(localBatch.history.length >= 3) score += 20;

        setTrustScore(score);

        // 📅 EXPIRY CHECK
        const currentTime = Math.floor(Date.now() / 1000);

        if(Number(result.expiryDate) < currentTime){
          setStatus("expired");
        }
        else if(score >= 80){
          setStatus("authentic");
        }
        else{
          setStatus("suspicious");
        }

      }else{
        setHistory([]);
        setStatus("not_found");
        setTrustScore(0);
      }

    }catch(err){
      console.log(err);
      setError("Error fetching batch. Check contract or network.");
      setStatus("not_found");
    }
  }

  // 📷 QR SCANNER
  useEffect(()=>{

    const scanner = new Html5QrcodeScanner(
      "reader",
      {fps:10,qrbox:250}
    );

    scanner.render(

      (decodedText)=>{

        const parts = decodedText.split("batchId=");

        if(parts.length>1){

          const id = parts[1];

          setBatchId(id);
          fetchBatch(id);
        }

        scanner.clear();
      },

      (error)=>{}
    );

  },[]);

  return(

    <div className="container">

      <div className="card">

        <h2>Verify Medicine</h2>

        {/* QR SCANNER */}
        <div id="reader"></div>

        {/* MANUAL INPUT */}
        <input
          placeholder="Enter Batch ID manually"
          value={batchId}
          onChange={(e)=>setBatchId(e.target.value)}
        />

        <button onClick={()=>fetchBatch(batchId)}>
          Verify
        </button>

        {error && (
          <p style={{color:"red"}}>{error}</p>
        )}

        {batchId && (
          <p><b>Batch ID:</b> {batchId}</p>
        )}

        {/* BLOCKCHAIN DETAILS */}
        {data && (

          <div style={{marginTop:"20px"}}>

            <h3>Medicine Details</h3>

            <p><b>Name:</b> {data.medicineName}</p>

            <p><b>Location:</b> {data.location}</p>

            {/* ✅ FIXED EXPIRY FORMAT */}
            <p><b>Expiry:</b> {
              new Date(Number(data.expiryDate) * 1000).toLocaleDateString()
            }</p>

            {/* ✅ SHORT WALLET */}
            <p><b>Current Owner:</b> {
              `${data.currentOwner.slice(0,6)}...${data.currentOwner.slice(-4)}`
            }</p>

          </div>

        )}

        {/* SUPPLY CHAIN */}
        {history.length > 0 && (

          <div style={{marginTop:"20px"}}>

            <h3>Supply Chain</h3>

            {history.map((h,i)=>(
              <p key={i}>
                {h.step} → {h.owner.slice(0,6)}...{h.owner.slice(-4)}
              </p>
            ))}

          </div>

        )}

        {/* TRUST SCORE */}
        {trustScore > 0 && (

          <div style={{marginTop:"20px"}}>

            <h3>Trust Score</h3>

            <p style={{
              fontSize:"20px",
              color: trustScore >= 80 ? "green" : "orange"
            }}>
              {trustScore}/100
            </p>

          </div>

        )}

        {/* STATUS */}
        {status && (

          <div style={{marginTop:"20px"}}>

            <h3>Verification Result</h3>

            {status === "authentic" && (
              <p style={{color:"green", fontWeight:"bold", fontSize:"18px"}}>
                ✔ AUTHENTIC MEDICINE
              </p>
            )}

            {status === "suspicious" && (
              <p style={{color:"orange", fontWeight:"bold", fontSize:"18px"}}>
                ⚠ SUSPICIOUS PRODUCT
              </p>
            )}

            {status === "expired" && (
              <p style={{color:"red", fontWeight:"bold", fontSize:"18px"}}>
                ❌ EXPIRED MEDICINE
              </p>
            )}

            {status === "not_found" && (
              <p style={{color:"red", fontWeight:"bold", fontSize:"18px"}}>
                ❌ NO RECORD FOUND
              </p>
            )}

          </div>

        )}

      </div>

    </div>

  )
}