let selectedCards = "";          // Currently selected Cards
let currentRotation = 0;
let rotationangle = 5;// Current Rotation of the Board




$(document).ready(function(){
    $('.displayedCard').bind('mousewheel', function(e){
        if(e.originalEvent.wheelDelta /120 > 0) {
                    $(this).css('filter', 'invert(100%)');
        }
        else{
            $(this).css('filter', 'invert(0%)');
        }

    });
});

//keylistener if the h key is pressed
$(document).ready(function(){
    $(document).keydown(function(e){
        if(e.keyCode == 82){

                if (currentRotation == 360){
                    currentRotation = 0
                    $('.displayedCard').css("transform", "rotate(" + currentRotation + "deg)");

                }
                else {
                    currentRotation += rotationangle ;
                    $('.displayedCard').css("transform", "rotate(" + currentRotation + "deg)");
                }
        }

        });

    });




        function addCard(card,currentTurn,asker){
    if (currentTurn == asker){
        if (!selectedCards.includes(card)){
            selectedCards = selectedCards + " " + card

            let theImg = document.getElementById(card);
            theImg.style.border = "5px solid #FF0000";

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



