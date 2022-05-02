// Project Set Up, creating a background canvas for game
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d') ;

canvas.width = 1024; // Establishing canvas height and width (eventually want to be variable)
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); 

const gravity = 0.7;

const background = new Sprite({ // this will use the specified image as background
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})
const shop = new Sprite({ // this will use the specified image as background
    position: {
        x: 620,
        y: 140
    },
    imageSrc: './img/shop.png',
    scale: 2.65,
    maxFrames: 6,
})



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
    color: 'yellow',
    imageSrc: 'img/Manzo/Idle.png',
    maxFrames: 8,
    scale: 2.5,
    offset: {
        x: 150,
        y: 110
    }
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

decreasetime();

// Animation Loops, call for position and velocty updates
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height); // Clears canvas to create a new unique frame for animation
    background.update(); // calling to establish background image
    player.update();
    shop.update();
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
            setTimeout(() => {
                enemy.isAttacking = false
            }, 100)
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