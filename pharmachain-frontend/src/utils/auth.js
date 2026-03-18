export function saveUser(data){
  let users = JSON.parse(localStorage.getItem("users")) || [];

  users.push(data);

  localStorage.setItem("users", JSON.stringify(users));
}

export function getUsers(){
  return JSON.parse(localStorage.getItem("users")) || [];
}

export function approveUser(address){
  let users = getUsers();

  users = users.map(u=>{
    if(u.address === address){
      return {...u, approved:true};
    }
    return u;
  });

  localStorage.setItem("users", JSON.stringify(users));
}

export function getUser(address){
  const users = getUsers();
  return users.find(u=>u.address === address);
}