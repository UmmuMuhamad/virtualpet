var GameState={
 

    create: function(){
        this.background = this.game.add.sprite(0, 0, 'backyard');
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add(this.placeItem, this);

        this.pet = this.game.add.sprite(100, 400, 'pet');
        this.pet.anchor.setTo(0.5);
        
        //pet animation
        this.pet.animations.add('funnyfaces', [1, 2, 3, 2, 1], 5, false);

        this.pet.customParams = {health: 100, fun: 100};
        
        //make draggable pet
        this.pet.inputEnabled = true;
        this.pet.input.enableDrag();
        
        this.apple = this.game.add.sprite(72, 570, 'apple');
        this.apple.anchor.setTo(0.5);
        this.apple.inputEnabled = true;
        this.apple.customParams = {health: 20}
        this.apple.events.onInputDown.add(this.pickItem, this);

        this.candy = this.game.add.sprite(144, 570, 'candy');
        this.candy.anchor.setTo(0.5);
        this.candy.inputEnabled = true;
        this.candy.customParams = {health: -10, fun: 10};
        this.candy.events.onInputDown.add(this.pickItem, this);

        this.toy = this.game.add.sprite(216, 570, 'toy');
        this.toy.anchor.setTo(0.5);
        this.toy.inputEnabled = true;
        this.toy.customParams = {fun: 20}
        this.toy.events.onInputDown.add(this.pickItem, this);

        this.rotate = this.game.add.sprite(288, 570, 'rotate');
        this.rotate.anchor.setTo(0.5);
        this.rotate.inputEnabled = true;
        this.rotate.events.onInputDown.add(this.rotatePet, this);

        this.buttons = [this.apple, this.candy, this.toy, this.rotate];

        //nothing is seleceted
        this.selectedItem = null;
        this.uiBlocked = false; //blocked user interface

        var style = { font: '20px Arial', fill: '#171515'}
        this.game.add.text(50, 20, 'Health:', style);
        this.game.add.text(200, 20, 'Fun:', style);

        this.healthText = this.game.add.text(120, 20, '0', style);
        this.funText = this.game.add.text(250, 20, '0', style);

        this.refreshStates();

        //reduce health every 5 seconds
        this.statsDecreaser = this.game.time.events.loop(Phaser.Timer.SECOND *5, this.reduceProperties, this);
    },

    pickItem: function(sprite, events){
        
        if(!this.uiBlocked){

            this.clearSelection();

            sprite.alpha = 0.4; //transparent

            this.selectedItem = sprite;
        }
    },

    rotatePet: function(sprite, events){
        if(!this.uiBlocked){
            
            this.uiBlocked = true;

            this.clearSelection();

            sprite.alpha = 0.4; //transparent

            var petRotation = this.game.add.tween(this.pet);

            petRotation.to({angle: '+720'}, 1000);//make it rotate twice in one second;
            
            petRotation.onComplete.add(function(){
                this.uiBlocked = false;

                sprite.alpha = 1;

                this.pet.customParams.fun += 10;
                
                this.refreshStates();
            }, this);

            petRotation.start();
        }
        
    },

    clearSelection: function(){
        this.buttons.forEach(function(element, index){
            element.alpha = 1;
        });

        this.selectedItem = null;
    },

    placeItem: function(sprite, events){

        if (this.selectedItem && !this.uiBlocked){
            var x = events.position.x;
        var y = events.position.y;

        var newItem = this.game.add.sprite(x, y, this.selectedItem.key);
        newItem.anchor.setTo(0.5);
        newItem.customParams = this.selectedItem.customParams;
        
        this.uiBlocked = true; 
        

        var petMovement = this.game.add.tween(this.pet);
        petMovement.to({x: x, y: y}, 700);
        petMovement.onComplete.add(function(){

            newItem.destroy(); //make item dissapear when the pet eat it
            
            this.pet.animations.play('funnyfaces');

            this.uiBlocked = false;

            var stat;
            for(stat in newItem.customParams){
                if(newItem.customParams.hasOwnProperty(stat)){
                    console.log(stat);
                    this.pet.customParams[stat] += newItem.customParams[stat];
                }
                
            }

            this.refreshStates(); //update the text
        }, this);
        petMovement.start();

     }
        
        
    },
    refreshStates: function(){
        this.healthText.text = this.pet.customParams.health;
        this.funText.text = this.pet.customParams.fun;
    },
    reduceProperties: function(){
        this.pet.customParams.health -=10;
        this.pet.customParams.fun -=15;
        this.refreshStates();
    },
    update: function(){
        if(this.pet.customParams.health <= 0 || this.pet.customParams.fun <=0){
            this.pet.frame =4;
            this.uiBlocked = true;

            //user will see the screen for 2 seconds befor game over 
            this.game.time.events.add(2000, this.gameOver, this); 
        }
    },
    gameOver: function(){
        this.state.start('HomeState', 'true', false, 'GAME OVERRR!');
    }
};
