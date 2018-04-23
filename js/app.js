/*
 * Create a list that holds all of your cards
 */
let card = document.getElementsByClassName('card');
let cards = [...card];
// prepare the deck of all cards in the game
const deck = document.getElementById('cards-deck');

// opened cards array
let cardsOpened = [];
let cardsMatchedNum = 0;

// number of moves
let cardMoves = 0;
let cardMovesCounter = document.querySelector('.moves');

 // rating - stars list
 let stars = document.querySelectorAll(".stars li");

// timer
let second = 0;
let minute = 0;
let hour = 0;
const timer = document.querySelector('.timer');
var interval;

// @description start new game when page is refreshed
document.body.onload = startGame();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// @description start a new game 
function startGame(){
    cards = shuffle(cards);
    // remove existing deck DOM
    deck.innerHTML = '';
    // remove all exisiting classes from each card
    // attach each card to the deck
    cards.forEach.call(cards, function(card) {
        card.classList.remove('show', 'open', 'match', 'disabled');
        //card.classList.add('open'); // DBG (debug statement)
        deck.appendChild(card);
    }); 
    cardsOpened = [];
    cardsMatchedNum = 0;

    // reset moves
    cardMoves = 0;
    cardMovesCounter.innerHTML = cardMoves;

    // reset rating
    stars.forEach.call(stars, function(star) {
        //star.style.color = "#FFD700";
        star.style.visibility = "visible";
    }); 

    // reset timer
    second = 0;
    minute = 0; 
    hour = 0;
    timer.innerHTML = minute+'mins '+second+'secs';
    clearInterval(interval);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of 'open' cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

deck.addEventListener('click', function (event) {
    // The event target is our clicked item
    let clicked = event.target;

    // Do not allow the grid section itself to be selected; only select divs inside the grid
    if (clicked.nodeName === 'UL') {
    	console.log('Opened card\'s frame clicked');	// DBG
    	return; 
    }
  
    if (cards.length > cardsMatchedNum) {
        cardsOpened.push(clicked);
        cardDisplay(clicked);
        cardCheck();        
        // console.log('Type: ' + clicked.type + ' NodeName: ' + clicked.nodeName);  // DBG
    };
 });

 // @description Display selected card
function cardDisplay(cardSelected){
    cardSelected.classList.add('open', 'show', 'disabled');
}

 // @description count player's moves
function cardCheck(){

    // check for matching
    if (cardsOpened.length == 2) {
        updateMovesAndRating();
        if (cardsOpened[0].type == cardsOpened[1].type ) {
            cardsMatched();
            cardsMatchedNum++;
            if (cards.length == (cardsMatchedNum * 2)) {
                console.log ('All cards matched!'); // DBG, TODO - open modal window
                clearInterval(interval);
            }
        } else {
            cardsNotMatched();
        }
    }
}

// @description Update number of moves, start timer on the first move, update rating
function updateMovesAndRating(){

    // increment and update moves counter
    cardMoves++;
    cardMovesCounter.innerHTML = cardMoves;

    //start timer on the first move
    if(cardMoves == 1){
        second = 0;
        minute = 0; 
        hour = 0;
        startTimer();
    }

    // update rating according to number of moves
    if (cardMoves > 12 && cardMoves <= 24){
        for( i= 0; i < 3; i++){
            if(i > 1){
                stars[i].style.visibility = "collapse";
            }
        }
    } else if (cardMoves > 24){
        for( i= 0; i < 3; i++){
            if(i > 0){
                stars[i].style.visibility = "collapse";
            }
        }
    }
}

// @description Game Timer
function startTimer(){
    interval = setInterval(function(){
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
        timer.innerHTML = minute+'mins '+second+'secs';
        // console.log(timer.innerHTML); // DBG
    },1000);
}

// @description 
// Note: for the animation of matched and not matched cards used Daniel's Eden, Animate CSS, 
//       see https://daneden.github.io/animate.css/ 
//       see https://github.com/daneden/animate.css/blob/master/README.md 
function cardsMatched(){
    console.log('cardsMatched'); // DBG
    cardsOpened[0].classList.add('match', 'animated', 'tada');
    cardsOpened[1].classList.add('match', 'animated', 'tada');
    cardsDisable();
    setTimeout(function(){
        cardsOpened[0].classList.remove('open', 'show', 'notmatched', 'animated', 'tada');
        cardsOpened[1].classList.remove('open', 'show', 'notmatched', 'animated', 'tada');
        cardsEnable();
        cardsOpened = [];
    },800);
}

// @description 
function cardsNotMatched(){
    console.log('cardsNotMatched');  // DBG
    cardsOpened[0].classList.add('notmatched', 'animated', 'wobble');
    cardsOpened[1].classList.add('notmatched', 'animated', 'wobble');
    cardsDisable();
    setTimeout(function(){
        cardsOpened[0].classList.remove('open', 'show', 'notmatched', 'animated', 'wobble');
        cardsOpened[1].classList.remove('open', 'show', 'notmatched', 'animated', 'wobble');
        cardsEnable();
        cardsOpened = [];
    },900);
}

// @description 
// matched cards allready disabled
function cardsDisable(){
    console.log('cardsDisable');  // DBG
    cards.forEach.call(cards, function(card) {
        if (!card.classList.contains('match')) {
            card.classList.add('disabled');
        }
    }); 
}

// @description 
// all but matched
function cardsEnable(){
    console.log('cardsEnable');  // DBG
    cards.forEach.call(cards, function(card) {
        if (!card.classList.contains('match')) {
            card.classList.remove('disabled');
        }
    }); 
}
