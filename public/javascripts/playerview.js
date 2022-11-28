let selectedCards = "";          // Currently selected Cards
let currentRotation = 0;
let rotationangle = 5;// Current Rotation of the Board


//keylistener if the r key is pressed


async function playSelectedCards(player) {
    if ((selectedCards != "")) {
        const req = "/playCard2P/" + selectedCards;
        await getJSON(req);
    }
    selectedCards = "";

}

async function getJSON(url) {
    const res = await fetch(url, {
        method: 'POST'
    })
    if (res.ok)
        await loadJson();

    else
        console.log("page failed loading");
}
//------------------JSON------------------//

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

$( document ).ready(function() {
    console.log( "Document is ready, filling grid" );
    loadJson();
});

    function createSingleCard(symbol,value,turn,player){
        let card = symbol + value;
        const newDiv = document.createElement("input");
        newDiv.setAttribute("type", "image");
        newDiv.setAttribute("class", "playingBoard player1 img-fluid displayedCard spacingright");
        //set im src attribure

        newDiv.setAttribute("src", "/assets/images2/"+ card +".png");
        newDiv.setAttribute("id", card);
        newDiv.setAttribute("onclick", "addCard("+card+", "+turn+", "+player+")");
        newDiv.onclick = function() {addCard(card,turn,player);};
        return newDiv;

    }

async function createCards(json) {
    turn = json.turn + 1;
    var i = 0
    let x = ""
    document.querySelectorAll('.playingBoard').forEach(e => e.remove());


    for (let i in json.player1.karten) {
        let symbol = json.player1.karten[i].symbol;
        let value = json.player1.karten[i].value;

        let cCard = createSingleCard(symbol,value,turn,1);
        originalDiv = $('#endplayer1')[0];

        originalDiv.parentNode.insertBefore(cCard, originalDiv);


    }
    if (!(json.board.anzahl == 0)){
        for (let i in json.board.karten) {
            let symbol = json.board.karten[i].symbol;
            let value = json.board.karten[i].value;
            let cCard = createSingleCard(symbol,value,turn,1);
            originalDiv = $('#endboard')[0];


            originalDiv.parentNode.insertBefore(cCard, originalDiv);
        }
    }

    for (let i in json.player2.karten) {
        let symbol = json.player2.karten[i].symbol;
        let value = json.player2.karten[i].value;

        let cCard = createSingleCard(symbol,value,turn,2);
        originalDiv = $('#endplayer2')[0];
        originalDiv.parentNode.insertBefore(cCard, originalDiv);
    }

    $('#currentPlayerButton')[0].textContent = turn;;



    player2Cards = json.player2.karten
    boardCards = json.board.karten

    let message = json.message
    $('#messageDisplay')[0].textContent = message;

}

function backToLobby() {
    window.location.href = "/lobby";
}

async function skip(player) {
    const req = "/2Pskip";
    await getJSON(req);
}
function reload(player){
    window.location.href = "/playerView/"+ player;
}

 function addCard(card,currentTurn,asker){
        console.log(selectedCards);
    if (currentTurn == asker){
        if (!selectedCards.includes(card)){
            selectedCards = selectedCards + " " + card

            document.getElementById(card).style.border='5px solid #FF0000';

        }
        else {
            selectedCards = selectedCards.replace(card, "")
            if(selectedCards[0].includes(" ")){
                selectedCards = selectedCards.replace(" ", "")
            }


            const theImg = document.getElementById(card);
            theImg.style.border = "";


        }
    }



}

function test(){

}
async function startGame() {
    const req = "/2PnewGame";
    await getJSON(req);
}