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