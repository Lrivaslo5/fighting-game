// detect for collision between two rectangles, resuable for enemy and main player
function rectangularCollision({rectangle1, rectangle2}) {
    return( //determines if rectangles are touching, considers x and y positioning
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height 
    );
}

function determineWinner({player, enemy, clockId}){ // Function determines winner based on health or timer
    clearTimeout(clockId);
    document.querySelector('#display-message').style.display = "flex"; // allows for display message to appear when winner is determined
    if(player.health === enemy.health) {
        document.querySelector('#display-message').innerHTML = "Tie!";
    } 
    if(player.health > enemy.health) {
        document.querySelector('#display-message').innerHTML = "Player 1 Wins!";
    }   
    if(player.health < enemy.health) {
        document.querySelector('#display-message').innerHTML = "Player 2 Wins!";
    }               
}


// Countdown timer will evenutally call function to determine winner

let clock = 45;
let clockId; // Used to end timer once winner has been determined

function decreasetime(){
    if(clock > 0){
        clockId = setTimeout(decreasetime, 1000);
        clock--;
        document.querySelector('#clock').innerHTML = clock;
    }
    if(clock === 0){
        determineWinner({player, enemy, clockId});
    }
}
