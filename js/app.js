/*
*
***********************Enemy**********************
*
*/

// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each instance 
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
     this.x += this.speed * dt;

     //loops enemies
     if (this.x >= 505) {
        this.x = 0;
     }
     //checks for collision and starts player over if collision occurs.
     if (player.y - 40 <= this.y && player.x - 65 <= this.x
     && player.y + 40 >= this.y && player.x + 65 >= this.x) {
        console.log('collided');
        player.resetPos();
        playerGameInfo.deductLife();
        playerGameInfo.loseGame();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};


/*
*
*********************Player**************************
*
*/

let Player = function(x,y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-boy.png'
};

Player.prototype.update = function() {
  
};

//adjusts players position back to the beginning
Player.prototype.resetPos = function() {
        this.x = 200;
        this.y = 380;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};



//handles all of the inputs from the user
Player.prototype.handleInput = function(keyPress) {
    //&& this.x(or y) adds border functionality
    if (keyPress == 'left' && this.x > 0) {
        player.x -= player.speed;
    }

    if (keyPress == 'up' && this.y > -20) {
        player.y -= player.speed - 20;
    }

    if (keyPress == 'right' && this.x < 410) {
        player.x += player.speed;
    }

    if (keyPress == 'down' && this.y < 380) {
        player.y += player.speed - 20;
    }
    //if player reaches the water, resets to the beginning position,
    //adds points, updates, level, and runs the loseGame function if
    //player runs out of lives
    if (player.y === -20) {
        setTimeout(function() {
            player.resetPos()
            playerGameInfo.addPoints()
            playerGameInfo.updateLevel();
            playerGameInfo.loseGame();
        }, 50);
    }

    console.log('keyPress -' + keyPress);
};


/*
*
*
*************Game Info/ Updates***************
*
*
*/

//updates the lives, points, and level 
const playerGameInfo = {
    lives: 3,
    points: 0,
    level: 1,
    pointIncrement: 10,
    boundIncrement: 100,
    //starting lower boundary for enemy speed
    lowerBound: 20,
    //starting upper boundary for enemy speed
    upperBound: 150,
    refresLives: function() {
        $('#currentLives').text("Lives: " + this.lives);
    },
    refreshPoints: function() {
        $('#currentPoints').text("Points: " + this.points);
    },
    refreshLevel: function() {
        $('#currentLevel').text("Level: " + this.level);
    },
    deductLife: function() {
        this.lives -= 1;
        //resets lives based on new increment
        this.refresLives();
        console.log('life taken away', this.lives);

    },
    addPoints: function() {
        this.points += this.pointIncrement;
        console.log(this.points);
        //resets points based on new increment
        this.refreshPoints();
        console.log('you earned 10 points!');
    },

    //Each time a player earns 10 points/enters water they move on to next level.
    updateLevel: function() {
        //Updates enemy speed. 
        let level = this.points / this.pointIncrement;
        //Increments speed by 100 each time player reaches water
        this.lowerBound += this.boundIncrement;
        this.upperBound += this.boundIncrement;
        //resets speed based on new bound settings
        this.resetEnemySpeed();
        
        //increments level and updates html text
        this.level += 1;
        this.refreshLevel();
    },

    //Creates random number within designated range based off of lowerBound and upperBound.
    boundRandom: function() {
        return Math.random() * (this.upperBound - this.lowerBound + 1) + this.lowerBound;
    },

    //Returns 3 random numbers within designated range in an array
    getEnemySpeeds: function() {
        return [this.boundRandom(this.lowerBound,this.upperBound), 
        this.boundRandom(this.lowerBound,this.upperBound), 
        this.boundRandom(this.lowerBound,this.upperBound)];
    },

    resetEnemySpeed: function() {
        //will return an array with 3 randomized speeds based on
        //player's current level
        let levelSpeeds = this.getEnemySpeeds();
        //Assigns new speeds to enemies
        enemyOne.speed  = levelSpeeds[0];
        enemyTwo.speed = levelSpeeds[1];
        enemyThree.speed = levelSpeeds[2];
    },

    loseGame: function() {
        if (this.lives < 1) {
            alert("INDIGESTION!!!!!!");
            this.resetGame();
        };
    },

    resetGame: function() {
        this.lowerBound = 20;
        this.upperBound = 150;
        this.resetEnemySpeed();
        this.lives = 3;
        this.level = 1;
        this.points = 0;
        this.refreshLevel();
        this.refreshPoints();
        this.refresLives();
        console.log('heeey');
    }

};

/*
*********************************************************
*/


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
//enemy must start at 0 for the x, 

let levelSpeedInit = playerGameInfo.getEnemySpeeds();

let enemyOne = new Enemy(0, 235, levelSpeedInit[0]);
let enemyTwo = new Enemy(0, 140, levelSpeedInit[1]);
let enemyThree = new Enemy(0, 60, levelSpeedInit[2]);

let allEnemies = [enemyOne, enemyTwo, enemyThree];
let player = new Player(200, 380, 70);
let enemy = ""



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
