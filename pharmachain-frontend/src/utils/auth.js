export function saveUser(data){

  let users = JSON.parse(localStorage.getItem("users")) || [];
  

  users.push({
    ...data,
    status: "pending"   // pending / approved / rejected
  });

  localStorage.setItem("users", JSON.stringify(users));
}

export function getUsers(){
  return JSON.parse(localStorage.getItem("users")) || [];
}

export function updateStatus(address, newStatus){

  let users = getUsers();

  users = users.map(u=>{
    if(u.address === address){
      return {...u, status:newStatus};
    }
    return u;
  });

  localStorage.setItem("users", JSON.stringify(users));
}

export function getUser(address){
  const users = getUsers();
  return users.find(u=>u.address === address);
}