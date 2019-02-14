// TUTO BG
var webSocket = new WebSocket("ws://" + window.location.host + "/socket");

const sendMessage = () => {
    var msg = {
        from: "sender",
        to: "recipient",
        text: "pretty text",
        date: Date.now()
    }

    webSocket.send(JSON.stringify(msg));
}

webSocket.onmessage = event => {
    var msg = JSON.parse(event.data);

    if (msg.to == "le receveur") {
        var div = document.createElement("p");
        div.innerHTML = msg.from + ": " + msg.text + " à " + msg.date;
        //Exemple pourri avec mon high level de js
    }
}