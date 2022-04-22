let Game = {

  width: 1000,
  height: 1000,
  scale: 2,
  loopTime: 270,
  squareHeight: 40,
  borderShrinkFactor: .09,
  numBlocks: 20,

 

  background: '#282828',
  appleColor: '#f51439',
  snakeColor: '#008000',
  borderColor: '#ffd700',

  score: 0,

  apple: {x:-1, y:-1},
  
  snake: [
    {x:3, y:1},
    {x:2, y:1},
  ],
  velocity: {x: 1, y: 0},

  init() {
    this.squareHeight = this.width / this.numBlocks;
    this.borderShrink = this.squareHeight * this.borderShrinkFactor;
    this.initCanvas();
    this.bindEvents();
    let render = timestamp => {
      requestAnimationFrame(render);
      if (!this.lastRendered || timestamp - this.lastRendered >= this.loopTime) {
        this.lastRendered = timestamp;
        this.loop();
      }
    };
    requestAnimationFrame(render);
  },
  initCanvas() {
    this.scoreHTML = document.getElementsByTagName('score')[0];
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.ctx = this.canvas.getContext('2d');

    this.scoreHTML.innerHTML = "Score: " + this.score

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Make canvas not look blurry on high-res screens
    this.canvas.style.width = this.width / this.scale;
    this.canvas.style.height = this.height / this.scale;

    this.clearCanvas();
    this.drawBorder();
  },
  drawBorder() {
    for (let i = 0; i < this.numBlocks; i++) {
      this.drawSquare(0, i, this.borderColor);
      this.drawSquare(i, 0, this.borderColor);
      this.drawSquare(this.numBlocks - 1, i, this.borderColor);
      this.drawSquare(i, this.numBlocks - 1, this.borderColor);
    }
  },
  clearCanvas() {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
  },
  bindEvents() {
    document.addEventListener("keydown", (event) => {
      const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"

      switch (key) {
        case "ArrowLeft":
          // Left pressed
          this.velocity = {
            x: -1,
            y: 0,
          };
          event.preventDefault();
          break;
        case "ArrowRight":
          // Right pressed
          this.velocity = {
            x: 1,
            y: 0,
          };
          event.preventDefault();
          break;
        case "ArrowUp":
          // Up pressed
          this.velocity = {
            x: 0,
            y: -1,
          };
          event.preventDefault();
          break;
        case "ArrowDown":
          // Down pressed
          this.velocity = {
            x: 0,
            y: 1,
          };
          event.preventDefault();
          break;
      }
    });
  },
  drawSquare(x, y, color=this.snakeColor) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.squareHeight * x + this.borderShrink,
                      this.squareHeight * y + this.borderShrink,
                      this.squareHeight - (this.borderShrink * 2),
                      this.squareHeight - (this.borderShrink * 2));
  },
  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  gameOver() {
    window.location.reload();
  },
  /*
   * This function is called every loopTime milliseconds
   * and should update the game state and then call draw
   */
  loop() {
    // Implementation here...
    // internal representation // changes


    // snake rendering with head leading direction
      this.snake = this.snake.map((snakePiece) => {

        
        const currentIndex = this.snake.indexOf(snakePiece);
        
        if (currentIndex === 0) {
          return {x: snakePiece.x + this.velocity.x, y: snakePiece.y + this.velocity.y}
        } else {
          return {x: this.snake[currentIndex - 1].x, y: this.snake[currentIndex - 1].y}
        }

      });

      // snake eats apple and grows
      let snakeEnd = this.snake.length - 1
      let snakeEndX = this.snake[snakeEnd].x;
      let snakeEndY = this.snake[snakeEnd].y;

      if(this.snake[0].x === this.apple.x && this.snake[0].y === this.apple.y) {
        console.log("Eat!");
        this.score++;
        this.scoreHTML.innerHTML = "Score: " + this.score
        this.snake.push({x: snakeEndX, y: snakeEndY})

        for(let applePiece in this.apple) {
          this.apple[applePiece] = this.randomInteger(1,14)
         }
      }

      let outBoundsY = [0, this.numBlocks - 1]
      let outBoundsX = [this.numBlocks -  1, 0]


      // out of bounds death
      if(outBoundsY.includes(this.snake[0].y) || outBoundsX.includes(this.snake[0].x)) {
        this.gameOver();
      }

      // snake hitting snake death
      for(let i = 1; i < this.snake.length; i++) {
          if(this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
            this.gameOver();
          }
      }

      if( this.apple.x === -1 && this.apple.y === -1 ) {
        for(let applePiece in this.apple) {
         this.apple[applePiece] = this.randomInteger(1,14)
        }
      }


    this.draw();
  },
  // Implement drawing logic in this function
  draw() {
    this.clearCanvas();
    this.drawBorder();
    this.snake.forEach(snake => this.drawSquare(snake.x, snake.y, this.snakeColor));
    this.drawSquare(this.apple.x, this.apple.y, this.appleColor);

    // Implementation here...
    // result of internal changes
  },
};

Game.init();
