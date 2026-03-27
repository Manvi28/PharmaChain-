export function saveBatch(batch){

let batches = JSON.parse(localStorage.getItem("batches")) || [];

batches.push({
  ...batch,
  history: [
    {
      step: "Manufactured",
      owner: batch.owner
    }
  ]
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
export function rejectBatch(batchId, data){

  let batches = getBatches();

  const updatedBatches = batches.map(b => {

    // ✅ STRICT MATCH (IMPORTANT)
    if (String(b.batchId) === String(batchId)) {
      return {
        ...b,
        status: "Rejected",
        rejectionReason: data.reason,
        proof: data.proof
      };
    }

    // ✅ RETURN ORIGINAL (DON'T TOUCH OTHERS)
    return { ...b };
  });

  localStorage.setItem("batches", JSON.stringify(updatedBatches));
}
export function updateBatchStatusLocal(batchId, status){

  const batches = JSON.parse(localStorage.getItem("batches")) || [];

  const updated = batches.map(b => {
    if(b.batchId === batchId){
      return { ...b, status };
    }
    return b;
  });

  localStorage.setItem("batches", JSON.stringify(updated));
}