let selectedCards = "";          // Currently selected Cards
let currentRotation = 0;
let rotationangle = 5;// Current Rotation of the Board
let socket;


//keylistener if the r key is pressed


window.onload = () => {
    loadJson()
    webSocketInit();
}

function webSocketInit() {
    socket = new WebSocket("ws://localhost:9000/websocket");
    socket.onopen = () => console.log("Connection is there");
    socket.onclose = () => console.log("Connection closed");
    socket.onerror = () => console.log("Connection error");
    socket.onmessage = function (event) {
        //console.log(JSON.parse(event.data));
        createCards(JSON.parse(event.data)).then(r => console.log("Created Cards from Msg"));
    }

}

async function playSelectedCards() {

    if ((selectedCards !== "")) {
        const req = "/playCard2P/" + selectedCards;
        await getJSON(req);

        selectedCards = "";
    }


}

function loadJson() {

    $.ajax({
        method: "GET",
        url: "/game/json",
        dataType: "json",

        success: function (result) {
            createCards(result);

        }
    });
}

async function getJSON(url) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json */*',
            'Content-Type': 'application/json'
        },
        body: ""
    })
    if (res.ok) {
        socket.send(`Data: ${await res}`);
        console.log("Sent Data");
    } else {
        console.log("page failed loading");
    }
}

//------------------JSON------------------//


function createSingleCard(symbol, value, turn, player) {
    let card = symbol + value;
    const newDiv = document.createElement("input");
    newDiv.setAttribute("type", "image");
    newDiv.setAttribute("class", "playingBoard player1 img-fluid displayedCard spacingright");
    //set im src attribure

    newDiv.setAttribute("src", "/assets/images2/" + card + ".png");
    newDiv.setAttribute("id", card);
    newDiv.setAttribute("onclick", "addCard(" + card + ", " + turn + ", " + player + ")");
    newDiv.onclick = function () {
        addCard(card, turn, player);
    };
    return newDiv;

}

async function createCards(json) {
    let selectedPlayer = $('#selectedPlayer')[0].textContent
    turn = json.turn + 1;
    var i = 0
    let x = ""
    document.querySelectorAll('.playingBoard').forEach(e => e.remove());

    if (selectedPlayer == 1 && json.player1.anzahl != 0) {
        for (let i in json.player1.karten) {
            let symbol = json.player1.karten[i].symbol;
            let value = json.player1.karten[i].value;

            let cCard = createSingleCard(symbol, value, turn, 1);
            originalDiv = $('#endplayer1')[0];

            originalDiv.parentNode.insertBefore(cCard, originalDiv);


        }
    } else {
        if (json.player2.anzahl != 0 && selectedPlayer == 2) {
            for (let i in json.player2.karten) {
                let symbol = json.player2.karten[i].symbol;
                let value = json.player2.karten[i].value;

                let cCard = createSingleCard(symbol, value, turn, 2);
                originalDiv = $('#endplayer1')[0];
                originalDiv.parentNode.insertBefore(cCard, originalDiv);
            }
        }

    }

    if (!(json.board.anzahl == 0)) {
        for (let i in json.board.karten) {
            let symbol = json.board.karten[i].symbol;
            let value = json.board.karten[i].value;
            let cCard = createSingleCard(symbol, value, turn, 1);
            originalDiv = $('#endboard')[0];


            originalDiv.parentNode.insertBefore(cCard, originalDiv);
        }
    }


    $('#currentPlayerButton')[0].textContent = turn;


    player2Cards = json.player2.karten
    boardCards = json.board.karten

    let message = json.message
    $('#messageDisplay')[0].textContent = message;

}

function backToLobby() {
    window.location.href = "/lobby";
}

async function skip(player) {
    let asker = $('#currentPlayerButton')[0].textContent = turn;
    let selectedPlayer = $('#selectedPlayer')[0].textContent
    if (asker == selectedPlayer) {
        const req = "/2Pskip";
        await getJSON(req);
    }

}

async function nextRound() {
    const req = "/nextround2P";
    await getJSON(req);


}

function addCard(card, currentTurn, asker) {
    console.log(selectedCards);
    if (currentTurn == asker) {
        if (!selectedCards.includes(card)) {
            selectedCards = selectedCards + " " + card

            document.getElementById(card).style.border = '5px solid #FF0000';

        } else {
            selectedCards = selectedCards.replace(card, "")
            if (selectedCards[0].includes(" ")) {
                selectedCards = selectedCards.replace(" ", "")
            }


            const theImg = document.getElementById(card);
            theImg.style.border = "";


        }
    }


}

function test() {

}

async function startGame() {
    const req = "/2PnewGame";
    await getJSON(req);
}

