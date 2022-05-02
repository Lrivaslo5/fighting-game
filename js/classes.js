class Sprite{
    constructor({position, imageSrc, scale = 1 , maxFrames = 1 }){ 
        this.position  = position; 
        this.height = 150;
        this.width = 50;
        this.image = new Image(); //creates image within JS using native API object
        this.image.src = imageSrc; //specify source of image we are creating
        this.scale = scale;
        this.maxFrames = maxFrames;
        this.numFrames = 0; //allows you to dtermine the nuymber of frames you will be moving animation by
        this.framesElapsed = 0;
        this.framesTime = 5; // determines time between frame transtion for animation
    }

    draw() {
        c.drawImage( // creates image using the size of determined above
            this.image,
            this.numFrames * (this.image.width / this.maxFrames),  // Illustrated here, move by frames determined in "Sprite" object
            0,
            this.image.width / this.maxFrames,  // cropping image to allow us to move throguh images and create animation
            this.image.height,
            this.position.x, 
            this.position.y, 
            (this.image.width / this.maxFrames) * this.scale,  // divided by the number of frames
            this.image.height * this.scale
        ) 
    }
    update() {  
        this.draw();
        this.framesElapsed++;
        if(this.framesElapsed % this.framesTime === 0) { // allows for time between frame transition
            if (this.numFrames < this.maxFrames - 1){
                this.numFrames++      
            } else {
                this.numFrames = 0;
            }
        }

      
        
      
    }
}


// Using OOP to ensure that avatars can interact and have different attributes -- Ex. Position, velocity
class Fighter{
    constructor({position, velocity, color, offset}){ // position/velcoity are passed as an object to minimze importance of order and allows for only one to be passed if needed
        this.position  = position; // instance of object destructuing allows for cleaner syntax and same functionality
        this.velocity = velocity;
        this.height = 160;
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
            c.fillStyle = 'red'
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
        
        if(this.position.y + this.height >= canvas.height - 99) { // Adding a floor to stop velocity change
            this.velocity.y = 0;
        } else 
        this.velocity.y += gravity // increase of Y-velocity allows for use to simulate gravity
    }
}