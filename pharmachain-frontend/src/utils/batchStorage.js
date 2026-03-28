export function saveBatch(batch){

let batches = JSON.parse(localStorage.getItem("batches")) || [];

batches.push({
  ...batch,
  history: [
    {
      step: "Manufactured",
      owner: batch.owner
    }
  ],
  // 🔥 NEW: scan tracking
  scans: []
});

localStorage.setItem("batches", JSON.stringify(batches));

}

export function getBatches(){
return JSON.parse(localStorage.getItem("batches")) || [];
}

export function updateBatchHistory(batchId,newOwner){

let batches = getBatches();

batches = batches.map(b=>{
  if(b.batchId === batchId){
    return {
      ...b,
      owner:newOwner,
      history:[
        ...b.history,
        {
          step:"Transferred",
          owner:newOwner
        }
      ]
    }
  }
  return b;
});

localStorage.setItem("batches", JSON.stringify(batches));

}

// 🔥 REJECT SYSTEM
export function rejectBatch(batchId, data){

  let batches = getBatches();

  const updatedBatches = batches.map(b => {

    if (String(b.batchId) === String(batchId)) {
      return {
        ...b,
        status: "Rejected",
        rejectionReason: data.reason,
        proof: data.proof
      };
    }

    return { ...b };
  });

  localStorage.setItem("batches", JSON.stringify(updatedBatches));
}

// 🔥 STATUS UPDATE (SOLD / DAMAGED / ETC)
export function updateBatchStatusLocal(batchId, status){

  const batches = JSON.parse(localStorage.getItem("batches")) || [];

  const updated = batches.map(b => {
    if(String(b.batchId) === String(batchId)){
      return { ...b, status };
    }
    return b;
  });

  localStorage.setItem("batches", JSON.stringify(updated));
}

//////////////////////////////////////////////////////
// 🔥 NEW SCAN SYSTEM (IMPORTANT)
//////////////////////////////////////////////////////

// 🔹 SAVE SCAN
export function addScan(batchId, location){

  let batches = getBatches();

  batches = batches.map(b=>{
    if(String(b.batchId) === String(batchId)){

      const newScan = {
        location: location,
        time: new Date().toISOString()
      };

      return {
        ...b,
        scans: b.scans ? [...b.scans, newScan] : [newScan]
      };
    }
    return b;
  });

  localStorage.setItem("batches", JSON.stringify(batches));
}


// 🔹 GET SCANS
export function getScans(batchId){

  const batches = getBatches();
  const batch = batches.find(b => String(b.batchId) === String(batchId));

  return batch?.scans || [];
}


// 🔹 CHECK MULTIPLE LOCATIONS
export function checkDuplicateLocations(batchId){

  const scans = getScans(batchId);

  const locations = scans.map(s => s.location);
  const uniqueLocations = [...new Set(locations)];

  return {
    isDuplicate: uniqueLocations.length > 1,
    locations: uniqueLocations
  };
}