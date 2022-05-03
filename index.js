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
    color: 'yellow',
    scale: 2.5,
    offset: {
        x: 150,
        y: 105
    },
    sprites: {
        idle: {
            imageSrc: 'img/Manzo/Idle.png',
            maxFrames: 8
        },
        run: {
            imageSrc: 'img/Manzo/Run.png',
            maxFrames: 8
        },
        jump: {
            imageSrc: 'img/Manzo/Jump.png',
            maxFrames: 2
        },
        fall: {
            imageSrc: 'img/Manzo/Fall.png',
            maxFrames: 2
        },
        attack1: {
            imageSrc: 'img/Manzo/Attack1.png',
            maxFrames: 4
        },
        hit: {
            imageSrc: 'img/Manzo/Take hit - white silhouette.png',
            maxFrames: 4
        },
        death: {
            imageSrc: 'img/Manzo/Death.png',
            maxFrames: 6
        },

    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 100,
        height: 50
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
    color: 'blue',
    scale: 2.5,
    offset: {
        x: 150,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: 'img/mazo-alt/Idle.png',
            maxFrames: 4
        },
        run: {
            imageSrc: 'img/mazo-alt/Run.png',
            maxFrames: 8
        },
        jump: {
            imageSrc: 'img/mazo-alt/Jump.png',
            maxFrames: 2
        },
        fall: {
            imageSrc: 'img/mazo-alt/Fall.png',
            maxFrames: 2
        },
        attack1: {
            imageSrc: 'img/mazo-alt/Attack1.png',
            maxFrames: 4
        },
        hit: {
            imageSrc: 'img/mazo-alt/Take hit.png',
            maxFrames: 3
        },
        death: {
            imageSrc: 'img/mazo-alt/Death.png',
            maxFrames: 7
        },
    },
    attackBox: {
        offset: {
            x: -100,
            y: 50,
        },
        width: 100,
        height: 50
    }
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
    c.fillStyle = 'rgba( 255, 255, 255, 0.1)'
    c.fillRect(0,0, canvas.width, canvas.height)
    enemy.update();

    player.velocity.x = 0;  // Created a responisve and functional movement system to inputs are interpretted correctly
    enemy.velocity.x = 0;

    // Main Player movement

    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSpriteframes('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSpriteframes('run');
    } else{ // Idle animation when there is no other animation activated
        player.switchSpriteframes('idle');
    }

    //Animate jump movement when jumping, also when falling
    if (player.velocity.y < 0){ 
        player.switchSpriteframes('jump');
    } else if (player.velocity.y > 0) {
        player.switchSpriteframes('fall');
    }

    //Enemy Player movement

    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSpriteframes('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSpriteframes('run');
    } else{
        enemy.switchSpriteframes('idle');
    }

    //Animate enemy jump movement when jumping, also when falling
    if (enemy.velocity.y < 0){ 
        enemy.switchSpriteframes('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSpriteframes('fall');
    }
    

    // Collison detection module -- only when attack box is overlapping enemy sprite x and y axis considered
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.numFrames === 2
    ){ // enemy is hit
        enemy.hit();
        player.isAttacking = false;
        console.log('hit');  
        gsap.to('#enemy-health', {  //using GSEP animations
            width: enemy.health + '%'
        })
    } 

    // if player misses, reset "is attacking" condition
    if(player.isAttacking && player.numFrames === 2) {
        player.isAttacking = false;
    }

//Enemy collision detection module

    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.numFrames === 2
        ){ // player is hit
            player.hit();
            enemy.isAttacking = false;
            gsap.to('#player-health', {  //using GSEP animations
                width: player.health + '%'
            })
    }

    // if enemy misses, reset "is attacking" condition
    if(enemy.isAttacking && enemy.numFrames === 2) {
        enemy.isAttacking = false;
    }

    // Game ending based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, clockId});
    }

}


animate();

// Creating Player Movement using event listeners

window.addEventListener('keydown' , (event) => { 
    if (!enemy.dead){

        switch(event.key){
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
            enemy.attack()
            break 
        }
    }

    if (!player.dead){
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
    
        }
    }
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