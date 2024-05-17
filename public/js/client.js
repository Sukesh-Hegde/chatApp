const socket=io();

var username;
let chats=document.querySelector(".chats");
let users_list = document.querySelector(".users-list");
let users_count= document.querySelector(".users-count");
let msg_send = document.getElementById("user-send");

let user_msg = document.getElementById("user-msg");
console.log("event", user_msg);

do{
    username=prompt("Enter your name: ");
}while(!username);

socket.emit("new-user-joined",username);

socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,'joined');
})


socket.on("user-disconnected", (socket_name) => {
  userJoinLeft(socket_name, "left");
});

function userJoinLeft(name,status){
    let div=document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b>${name}</b> ${status} the chat</p>`;
    div.innerHTML=content; 
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;

}

socket.on('user-list',(users)=>{
    users_list.innerHTML="";
    users_arr=Object.values(users);
    for(i=0;i<users_arr.length;i++){
        let p=document.createElement('p');
        p.innerText= users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML = users_arr.length;
})

msg_send.addEventListener("click", () => {
  let data = {
    user: username,
    msg: user_msg.value,
  };
  console.log(data);

  if (user_msg.value != "") {
    appendMessage(
      data,
      "outgoing"
    ); 
    socket.emit("message", data); 
    user_msg.value = "";
  }
});

function appendMessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content= `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('message',(data)=>{
  appendMessage(data,'incoming');
})