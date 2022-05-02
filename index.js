// Project Set Up, creating a background canvas for game
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d') ;

canvas.width = 1024; // Establishing canvas height and width (eventually want to be variable)
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); 

const gravity = 0.7
class Sprite{
    constructor({position}){ // position/velcoity are passed as an object to minimze importance of order and allows for only one to be passed if needed
        this.position  = position; // instance of object destructuing allows for cleaner syntax and same functionality
        this.height = 150;
        this.width = 50;
        }
    draw() {}
    update() { //This function will be used in the animation section to create a new frame for each loop
        this.draw();
    }
}
// Using OOP to ensure that avatars can interact and have different attributes -- Ex. Position, velocity
class Fighter{
    constructor({position, velocity, color, offset}){ // position/velcoity are passed as an object to minimze importance of order and allows for only one to be passed if needed
        this.position  = position; // instance of object destructuing allows for cleaner syntax and same functionality
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
    }

    attack(){ // attack module disactivates attacking state after 100 ms
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }



    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, 50, this.height);
        
        // Attack Box creation
        if(this.isAttacking){
            c.fillStyle = 'green'
            c.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y, 
                this.attackBox.width, 
                this.attackBox.height
            )
        }
    }


    update() { //This function will be used in the animation section to create a new frame for each loop
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y; 
        
        if(this.position.y + this.height >= canvas.height) { // Adding a floor to stop velocity change
            this.velocity.y = 0;
        } else 
        this.velocity.y += gravity // increase of Y-velocity allows for use to simulate gravity
    }
}

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    color: 'yellow'
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue'
})



console.log(player);


const keys = { // 
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

// detect for collision between two rectangles, resuable for enemy and main player
    function rectangularCollision({rectangle1, rectangle2}) {
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height 
    );
}

function determineWinner({player, enemy, clockId}){
    clearTimeout(clockId);
    document.querySelector('#display-message').style.display = "flex";
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


// Countdown timer to determine game winner
let clock = 15;
let clockId;
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

decreasetime();

// Animation Loops, call for position and velocty updates
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height); // Clears canvas to create a new unique frame for animation
    player.update();
    enemy.update();

    player.velocity.x = 0;  // Created a responisve and functional movement system to inputs are interpretted correctly
    enemy.velocity.x = 0;

    // Main Player movement
    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
    }

    //Enemy Player movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    // Collison detection module -- only when attack box is overlapping enemy sprite x and y axis considered
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    ){
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemy-health').style.width = enemy.health + "%";
        console.log('hit');   
    } 
    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ){
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector('#player-health').style.width = player.health + "%";
    console.log('enemy hit you');  
    }

    // Game ending based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, clockId});
    }

}


animate();

// Creating Player Movement using event listeners

window.addEventListener('keydown' , (event) => { 
    switch (event.key){ //Main Player controls
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a'
            break

        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd'
            break
            
        case 'w':
            player.velocity.y = -20;
            break  
        
        case ' ':
            player.attack();
            break

        // Enemy player controls
        case 'ArrowRight':  
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break

        case 'ArrowLeft': 
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break
            
        case 'ArrowUp':
            enemy.velocity.y = -20;
            break

        case 'ArrowDown':
            enemy.isAttacking = true;
            break 
    }
    console.log(event.key);
})

window.addEventListener('keyup' , (event) => {
    switch (event.key){
        case 'a':
            keys.a.pressed = false;
            break

        case 'd':
            keys.d.pressed = false;
            break
 
    }

// Enemy keys to stop actions after lifting keys
    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break
 
    }

    console.log(event.key);
})