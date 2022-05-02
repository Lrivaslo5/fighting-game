// Project Set Up, creating a background canvas for game
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d') ;

canvas.width = 1024; // Establishing canvas height and width (eventually want to be variable)
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); 

const gravity = 0.2

// Using OOP to ensure that avatars can interact and have different attributes -- Ex. Position, velocity
class Sprite{
    constructor({position, velocity}){ // position/velcoity are passed as an object to minimze importance of order and allows for only one to be passed if needed
        this.position  = position; // instance of object destructuing allows for cleaner syntax and same functionality
        this.velocity = velocity;
        this.height = 150;
        this.lastKey;
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, 50, this.height);
    }

    update() { //This function will be used in the animation section to create a new frame for each loop
        this.draw();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y; 
        
        if(this.position.y + this.height >= canvas.height) { // Adding a floor to stop velocity change
            this.velocity.y = 0;
        } else 
        this.velocity.y += gravity // increase of Y-velocity allows for use to simulate gravity
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
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

let lastKey 

// Animation Loops, call for position and velocty updates
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height); // Clears canvas to create a new unique frame for animation
    player.update();
    enemy.update();

    player.velocity.x = 0;  // Created a responisve and functional movement system to inputs are interpretted correctly

    // Main Player movement
    if(keys.a.pressed && lastKey === 'a') {
        player.velocity.x = -1;
    } else if (keys.d.pressed && lastKey === 'd') {
        player.velocity.x = 1;
    }

    //Enemy Player movement
    if(keys.ArrowLeft.pressed && lastKey === 'ArrowLeft') {
        enemy.velocity.x = -1;
    } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight') {
        enemy.velocity.x = 1;
    }
}




animate();

// Creating Player Movement using event listeners

window.addEventListener('keydown' , (event) => { 
    switch (event.key){ //Main Player controls
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a'
            break

        case 'd':
            keys.d.pressed = true;
            lastKey = 'd'
            break
            
        case 'w':
            player.velocity.y = -10;
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
            enemy.velocity.y = -10;
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

// Enemy keys
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