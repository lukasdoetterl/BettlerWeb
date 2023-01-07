
const app = Vue.createApp({})




app.component('nav-bar', {
    data() {

    }
    ,
    template: `
     <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #92A8D1;">
    <a class="navbar-brand" href="#">
        <img class= "logo event" src="assets/images2/logo.png">
        <span class="navbar-text">
            Bettler
        </span>

    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
            <li class="nav-item active">
                <a class="nav-link" href="/lobby">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link"href="/b"> Start a Game</a>
            </li>
            <li class="nav-item">
                <a class="nav-link"href="/playerviewX" > Player 1</a>
            </li>
            <li class="nav-item">
                <a class="nav-link"href="/playerview/2" > Player 2</a>
            </li>
            <li class="nav-item">
                <a class="nav-link"href="/chatview" > Chat</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/about">Rules</a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown link
                </a>
                <div class="dropdown-menu" aria-labelledby="Links">
                    <a class="dropdown-item" href="https://github.com/lukasdoetterl/BettlerWeb">Github</a>
                    <a class="dropdown-item" href="https://getbootstrap.com/">Bootstrap</a>
                </div>
            </li>
        </ul>
    </div>
    </nav>
    `
})

app.component('game_playerview', {
    data() {
        return {
            cards: [],
            selectedCards: "",
            socket: null
        }
    },

    created() {
        this.loadJson();
        this.webSocketInit();

    },

    methods: {
        addCard(card, currentTurn, asker) {
            console.log(this.selectedCards);
            if (currentTurn == asker) {
                if (!this.selectedCards.includes(card)) {
                    this.selectedCards = this.selectedCards + " " + card

                    document.getElementById(card).style.border = '5px solid #FF0000';

                } else {
                    this.selectedCards = this.selectedCards.replace(card, "")
                    if (this.selectedCards[0].includes(" ")) {
                        this.selectedCards = this.selectedCards.replace(" ", "")
                    }


                    const theImg = document.getElementById(card);
                    theImg.style.border = "";


                }
            }


        },
        createSingleCard(symbol, value, turn, player) {
    let card = symbol + value;
    const newDiv = document.createElement("input");
    newDiv.setAttribute("type", "image");
    newDiv.setAttribute("class", "playingBoard player1 img-fluid displayedCard spacingright");
    //set im src attribure

    newDiv.setAttribute("src", "/assets/images2/" + card + ".png");
    newDiv.setAttribute("id", card);
    //add the fucntion addCard to the onclick event


    newDiv.onclick = sucess => {
        this.addCard(card, turn, player);
    };
    return newDiv;

},
        async createCards(json) {
            let selectedPlayer = $('#selectedPlayer')[0].textContent
            let turn = json.turn + 1;
            var i = 0
            let x = ""
            document.querySelectorAll('.playingBoard').forEach(e => e.remove());

            if (selectedPlayer == 1 && json.player1.anzahl != 0) {
                for (let i in json.player1.karten) {
                    let symbol = json.player1.karten[i].symbol;
                    let value = json.player1.karten[i].value;

                    let cCard = this.createSingleCard(symbol, value, turn, 1);
                    let originalDiv = $('#endplayer1')[0];

                    originalDiv.parentNode.insertBefore(cCard, originalDiv);


                }
            } else {
                if (json.player2.anzahl != 0 && selectedPlayer == 2) {
                    for (let i in json.player2.karten) {
                        let symbol = json.player2.karten[i].symbol;
                        let value = json.player2.karten[i].value;

                        let cCard = this.createSingleCard(symbol, value, turn, 2);
                        let originalDiv = $('#endplayer1')[0];
                        originalDiv.parentNode.insertBefore(cCard, originalDiv);
                    }
                }

            }

            if (!(json.board.anzahl == 0)) {
                for (let i in json.board.karten) {
                    let symbol = json.board.karten[i].symbol;
                    let value = json.board.karten[i].value;
                    let cCard = this.createSingleCard(symbol, value, turn, 1);
                    let originalDiv = $('#endboard')[0];


                    originalDiv.parentNode.insertBefore(cCard, originalDiv);
                }
            }


            $('#currentPlayerButton')[0].textContent = turn;


            let player2Cards = json.player2.karten
            let boardCards = json.board.karten

            let message = json.message
            $('#messageDisplay')[0].textContent = message;

        },
        webSocketInit() {
            this.socket = new WebSocket("ws://localhost:9000/websocket");
            this.socket.onopen = () => console.log("Connection is there");
            this.socket.onclose = () => console.log("Connection closed");
            this.socket.onerror = () => console.log("Connection error");
            this.socket.onmessage = (event)=> {
                //console.log(JSON.parse(event.data));
                this.createCards(JSON.parse(event.data)).then(r => console.log("Created Cards from Msg"));
            }

        },
        async playSelectedCards() {

            if ((this.selectedCards !== "")) {
                const req = "/playCard2P/" + this.selectedCards;
                await this.getJSON(req);

                this.selectedCards = "";
            }


        },
        backToLobby() {
            window.location.href = "/lobby";
        },
        loadJson() {

            $.ajax({
                method: "GET",
                url: "/game/json",
                dataType: "json",

                success:  (result) => {
                    this.createCards(result);

                }
            });
        },
        async getJSON(url) {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json */*',
                    'Content-Type': 'application/json'
                },
                body: ""
            })
            if (res.ok) {
                this.socket.send(`Data: ${await res}`);
                console.log("Sent Data");
            } else {
                console.log("page failed loading");
            }
        },
        async skip(player) {
            let asker = $('#currentPlayerButton')[0].textContent = turn;
            let selectedPlayer = $('#selectedPlayer')[0].textContent
            if (asker == selectedPlayer) {
                const req = "/2Pskip";
                await this.getJSON(req);
            }

        },
        async nextRound() {
            const req = "/nextround2P";
            await this.getJSON(req);


        },
        async startGame() {
            const req = "/2PnewGame";
            await this.getJSON(req);
        }
    },
    template: `

<div class="container-fluid, spacingleft">
        <!-- main container -->
        <!-- Display the Game Message with primary alert-->

        <div class="container, spacingtop">
                <div class="row">
                        <div class="col">

                        </div>
                        <div class="col">

                        </div>
                        <div class="col">

                        </div>
                </div>



                <!-- Main Button Control Group-->

        <br>
        <div class="row">
        <div class="col">
        <div class="row">
                        <div class="col">
                                <div class="alert alert-info alert-dismissible fade show"  role="alert">
                                        <strong>Message :</strong> <p id="messageDisplay" ></p>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                        </button>
                                </div>
                        </div>
        </div>

        <button id= "currentPlayerButton" type="button" class="btn btn-primary spacingright">
                Current Player: <span class="badge badge-info"></span>
                <span class="sr-only"></span>
        </button>

        <button type="button" class="btn btn-outline-warning spacingright" @click="startGame()" data-bs-toggle="tooltip" data-bs-placement="top" title="Starts a Complete new Game(for match use next Round)">Start new Game</button>
        <button type="button" class="btn btn-outline-danger spacingright" @click="backToLobby()"data-bs-toggle="tooltip" data-bs-placement="top" title="Exit the Game(no save)">Exit</button>

        <br> <br> <br>
             <!-- Player 1 -->
                <div class="test" id = "endplayer1"> </div> <br>
        <!-- Board -->
                <div class="test"  id = "endboard"> </div> <br>

        <!-- Player 2 -->
                <div class="test"  id = "endplayer2"> </div><br>
                
                <br>
        <!-- Gameplay Buttons-->
        <button type="button" class="btn btn-outline-success spacingright" @click="playSelectedCards()"data-bs-toggle="tooltip" data-bs-placement="top" title="Play the Cards you have selected">Play Cards</button>
        <button type="button" class="btn btn-outline-secondary spacingright" @click="skip()"data-bs-toggle="tooltip" data-bs-placement="top" title="Skip your current turn if you dont want to or cant play">Skip</button>
        <button type="button" class="btn btn-outline-secondary spacingright" @click="nextRound()"data-bs-toggle="tooltip" data-bs-placement="top" title="play the next Round(after someone has won)">Next Round</button>

        <br>
                </div>



        </div>
        </div>


        </div>
</div>




`,



})

app.component('index_view', {

    data() {

    }
    ,
    template: `
        <div class="container-fluid">

      <div class="container">
        <div class="row">
          <div class="col-sm">
            <div class="card  h-100" >
              <img class="card-img-top" src="assets/images2/playingcards.png" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">Start!</h5>
                <p class="card-text">Go here to Start a PvP (Player versus Player) Game of Bettler where two People play against each other </p>
                <a href="/b" class="btn btn-outline-info">Go</a>
              </div>
            </div>
          </div>


          <div class="col-sm">
            <div class="card h-100" >
              <img class="card-img-top" src="assets/images2/rules.png" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">Rules ?</h5>
                <p class="card-text">If you are unsure about The Rules of the Game u can go here to check them out before u start Playing</p>
                <a href="/about" class="btn btn-outline-info">Unsure?</a>
              </div>
            </div>
          </div>

          <div class="col-sm">
            <div class="card h-100">
              <img class="card-img-top" src="assets/images2/info.png" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">Infos</h5>
                <p class="card-text">Some Information about The Project / also u can find some Links here</p>
                <a href="#" class="btn btn-outline-info">Learn Something</a>
              </div>
          </div>


        </div>


    </div>


    </div>
    </div>
    `
})

//new app component with the imported date picker
app.component('date_picker', {

    data() {

    }
    ,
    template: `
        <vaadin-date-picker placeholder="Pick a date">
        </vaadin-date-picker>
    `

})
//

app.mount('#main_container')


