

    var selectedCards = ""          // Currently selected Cards
    var normalheight = 10       //heightchange when selected (percent)
    var normalewidth = 10        //widthtchange when selected (percent)
    var extraheight = 10       //heightchange when selected (percent)
    var extrawidth = 10        //widthtchange when selected (percent)

    function addCard(card,currentTurn,asker){
    if (currentTurn == asker){
        if (!selectedCards.includes(card)){
            selectedCards = selectedCards + " " + card

            var theImg = document.getElementById(card);
            theImg.style.border = "5px solid #FF0000";

        }
        else {
            selectedCards = selectedCards.replace(card, "")
            if(selectedCards[0].includes(" ")){
                selectedCards = selectedCards.replace(" ", "")
            }


            var theImg = document.getElementById(card);
            theImg.style.border = "";


        }
    }



    }


    function test(){
        var theImg = document.getElementById('tester');
        theImg.height = theImg.height +20;
        theImg.width = theImg.width  +20;
        var textfi = document.getElementById("testText");
        document.getElementById('lbltipAddedComment').innerHTML = 'Your tip has been submitted!';

    }
    function startGame(){
        window.location.href = "/b"
    }
    function playSelectedCards() {
        if ((selectedCards != "")) {
            window.location.href = "/playCardBetter/" + selectedCards;
        }

    }

    function backToLobby() {
        window.location.href = "/lobby"
    }

    function nextRound(){
        window.location.href = "/nextround"
    }
    function skip(){
        window.location.href = "/betterskip"
    }
    function undo(){
        window.location.href = "/betterundo"
    }
    function redo(){
        window.location.href = "/betterredo"
    }



