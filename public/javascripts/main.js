

    var selectedCards = ""
    function addCard(card){
        if (!selectedCards.includes(card)){
            selectedCards = selectedCards + " " + card
            document.getElementById("selectedCards").value = selectedCards
        }
    }




    function playSelectedCards() {

        window.location.href = "/playCardBetter/" + selectedCards;

    }

    function nextRound(){
        window.location.href = "/nextround"
    }