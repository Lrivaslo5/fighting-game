class Sprite{
    constructor({position, imageSrc, scale = 1 , maxFrames = 1, offset = {x: 0, y: 0}}){ 
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
        this.offset = offset;
    }
// creates image using the size of determined above
    draw() {
        c.drawImage( 
            this.image,
            this.numFrames * (this.image.width / this.maxFrames),  // Illustrated here, move by frames determined in "Sprite" object
            0,
            this.image.width / this.maxFrames,  // cropping image to allow us to move throguh images and create animation
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.maxFrames) * this.scale,  // divided by the number of frames
            this.image.height * this.scale
        ) 
    }

   // Create a new function to animate frames
    animateFrames(){
        this.framesElapsed++;

        if(this.framesElapsed % this.framesTime === 0) { // allows for time between frame transition
            if (this.numFrames < this.maxFrames - 1){
                this.numFrames++      
            } else {
                this.numFrames = 0;
            }
        }
    }

    update() {  
        this.draw();
        this.animateFrames();
    }
}


// Using OOP to ensure that avatars can interact and have different attributes -- Ex. Position, velocity
class Fighter extends Sprite{ // all methods in sprite are avalible for fighter
    constructor({
        position, 
        velocity, // position/velcoity are passed as an object to minimze importance of order and allows for only one to be passed if needed
        color, 
        imageSrc, 
        scale = 1 , 
        maxFrames = 1,
        offset = {x: 0, y: 0},
        sprites
    }){ 
        super({
            position,
            imageSrc,
            scale,
            maxFrames,
            offset

        }); // calls constructor of parent to inherit these properties 
        this.velocity = velocity;   // instance of object destructuing allows for cleaner syntax and same functionality
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
        //Added from Sprite object
        this.numFrames = 0; 
        this.framesElapsed = 0;
        this.framesTime = 5; 
        this.sprites = sprites;

        for(const sprite in this.sprites){ //Looping through object
            sprites[sprite].image = new Image(); // sprite here is object key
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update() { //This function will be used in the animation section to create a new frame for each loop
        this.draw();
        this.animateFrames();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y; 
        

        // Adds gravity functionality
        if(this.position.y + this.height >= canvas.height - 99) { // Adding a floor to stop velocity change
            this.velocity.y = 0;
            this.position.y = 319.69999999999874;
        } else this.velocity.y += gravity // increase of Y-velocity allows for use to simulate gravity
    }

    attack(){ // attack module disactivates attacking state after 100 ms
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

    switchSpriteframes(sprite){
        switch (sprite){
            case 'idle':
                if (this.image != this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.maxFrames = this.sprites.idle.maxFrames;
                    this.numFrames = 0;
                }
                break;

            case 'run':
                if(this.image != this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.maxFrames = this.sprites.run.maxFrames;
                    this.numFrames = 0;
                }
                break;
            case 'jump':
                if(this.image != this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.maxFrames = this.sprites.jump.maxFrames;
                    this.numFrames = 0;
                }
                break;

            case 'fall':
                if(this.image != this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.maxFrames = this.sprites.fall.maxFrames;
                    this.numFrames = 0;
                }
                break;
        }
    }


}