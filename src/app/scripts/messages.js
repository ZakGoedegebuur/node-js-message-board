const socket = new WebSocket('ws://$$yourip$$:8051'); // ! your server's ip goes here
const delay = ms => new Promise(res => setTimeout(res, ms));

let messages = [];

const root = document.getElementById("messages-root");
const accountInput = document.getElementById("account-input");
const messageInput = document.getElementById("message-input");

if (localStorage["prevName"] === "anonymous user" || localStorage["prevName"] === undefined) {
  localStorage["prevName"] = "";
}

accountInput.value = localStorage["prevName"];

function updateDisplay() {
  localStorage["prevName"] = accountInput.value;
  root.replaceChildren();
  messages.map((message, index) => {
    const element = document.createElement("div");
    let text = document.createTextNode(`${message.text}`);
    element.appendChild(text);

    const childElement = document.createElement("div");
    if (message.sender === accountInput.value) {
      element.classList.add("message-element-right");
      //message.sender = "me";
    }
    const childText = document.createTextNode(` - ${message.sender}`);
    childElement.appendChild(childText);
    childElement.classList.add("message-sender");
    element.appendChild(childElement);

    root.appendChild(element);
    element.classList.add("message-element");
  });
}

socket.onmessage = ({data}) => {
  messages = JSON.parse(data);
  updateDisplay();
  root.scroll({ top: root.scrollHeight, behavior: 'smooth' });
}

socket.onopen = () => {
  console.log("Connected to server!");
}

socket.onclose = async () => {
  console.error("Disconnected from server!")
  while (socket.readyState === WebSocket.CLOSED) {
    await delay(5000);
    location.reload();
  }
}

function sendMessage() {
  if (messageInput.value.length > 0 && accountInput.value.length > 0) {
    let yourDate = new Date()
    yourDate.toISOString().split('T')[0];
    const offset = yourDate.getTimezoneOffset();
    yourDate = new Date(yourDate.getTime() - (offset*60*1000));
    yourDate = yourDate.toISOString().split('T')[0];
  
    var time = new Date();
    const t = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  
    const msg = {
      sender: accountInput.value,
      date: yourDate,
      time: t,
      text: messageInput.value
    }
  
    messageInput.value = "";
  
    socket.send(JSON.stringify(msg));
  }
}
