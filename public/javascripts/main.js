

    var selectedCards = ""          // Currently selected Cards
    var sizechangeheight = 20       //heightchange when selected
    var sizechangewidth = 20        //widthtchange when selected

    function addCard(card,currentTurn,asker){
    if (currentTurn == asker){
        if (!selectedCards.includes(card)){
            selectedCards = selectedCards + " " + card
            document.getElementById("selectedCards").value = selectedCards
            var theImg = document.getElementById(card);
            theImg.height = theImg.height + sizechangeheight;
            theImg.width = theImg.width + sizechangewidth;

        }
        else {
            selectedCards = selectedCards.replace(card, "")
            if(selectedCards[0].includes(" ")){
                selectedCards = selectedCards.replace(" ", "")
            }

            document.getElementById("selectedCards").value = selectedCards
            var theImg = document.getElementById(card);
            theImg.height = theImg.height - sizechangeheight;
            theImg.width = theImg.width - sizechangewidth;
        }
    }

    }

    function makeButtonsPink(){
        var buttons = document.getElementsByClassName("button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.backgroundColor = "#ff00ff";
        }
    }


    function playSelectedCards() {
        if ((selectedCards != "")) {
            window.location.href = "/playCardBetter/" + selectedCards;
        }

    function backToLobby() {
        window.location.href = "/lobbyt5"
    }






    }
    function nextRound(){
        window.location.href = "/nextround"
    }



