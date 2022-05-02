// Project Set Up
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d') ;

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height); 

// Using OOP to ensure that avatars can interact and have different attributes -- Ex. Position, Gravity
class Sprite{
    constructor({position, velocity}){ // position/velcoity are passed as an object to minimze importance of order and allows for only one to be passed if needed
        this.position  = position; // instance of object destructuing allows for cleaner syntax and same functionality
        this.velocity = velocity;
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, 50, 150);
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

player.draw();
enemy.draw();

console.log(player);

// Animation Loop

function animate() {
    console.log('p');
    window.requestAnimationFrame(animate);
    
}

animate();


