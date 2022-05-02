class Sprite{
    constructor({position, imageSrc}){ 
        this.position  = position; 
        this.height = 150;
        this.width = 50;
        this.image = new Image(); //creates image within JS using native API object
        this.image.src = imageSrc; //specify source of image we are creating
        }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y) // creates image using the size of determined above
    }
    update() {  
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
        
        if(this.position.y + this.height >= canvas.height - 98) { // Adding a floor to stop velocity change
            this.velocity.y = 0;
        } else 
        this.velocity.y += gravity // increase of Y-velocity allows for use to simulate gravity
    }
}