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
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, 50, this.height);
    }

    update() { //This function will be used in the animation section to create a new frame for each loop
        this.draw();
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

// Animation Loop, calls for position and velocty update

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black' // e
    c.fillRect(0, 0, canvas.width, canvas.height); // Clears canvas to create a new unique frame for animation
    player.update();
    enemy.update();
    
}

animate();


