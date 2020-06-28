class Vector2D {
  public x: number;
  public y: number;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(xPos: number, yPos: number, ctx) {
    let x0 = xPos - this.x/2;
    let y0 = yPos - this.y/2;
    let x1 = xPos + this.x/2;
    let y1 = yPos + this.y/2;

    ctx.strokeStyle = 'red';

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  }

  add(v: Vector2D) {
    this.x += v.x;
    this.y += v.y;
  }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

class Particle {
  pos: Vector2D;

  constructor(initPos: Vector2D) {
    this.pos = initPos;
  }

  applyForce(f: Vector2D) {
    this.pos.add(f);
  }

  draw(ctx) {
    ctx.fillRect(this.pos.x, this.pos.y, 5, 5);
  }
}

class VectorField {
  private grid: Vector2D[][];
  private particles: Particle[] = [];

  get w() {
    return this.grid[0].length;
  }
  get h() {
    return this.grid.length;
  }
  constructor(w: number, h: number, numParticles: number, ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.cWidth = ctx.canvas.width;
    this.cHeight = ctx.canvas.height
    
    this.grid = [];
    /*
    for (let i = 0; i < h; i++) {
      this.grid[i] = [];
      for (let j = 0; j < w; j++) {
        //Center coordinates
        let x = j - w / 2;
        let y = i - h / 2;

        this.grid[i][j] = new Vector2D(Math.cos(y - 5, x - 5);//initFunc(j, i);
      }
    }*/

    for (let i = 0; i < numParticles; i++) {
      this.particles[i] = new Particle(this.randomPos());
    }

    console.log(this.grid);
  }

  randomPos() {
    //Vector2D within canvas
    return new Vector2D(Math.random() * this.cWidth, 
                        Math.random() * this.cHeight);
  }

  draw() {
    //let spacingX: number  = this.cWidth / (this.grid[0].length - 1);
    //let spacingY: number = this.cHeight / (this.grid.length - 1);

    this.particles.forEach((p) => {
      if (p.pos.x > 0 && p.pos.x < this.cWidth 
          && p.pos.y > 0 && p.pos.y < this.cHeight) {

        //Find vector whose force acts upon p
        //let vectorXPos = Math.round(p.pos.x / spacingX);
        //let vectorYPos = Math.round(p.pos.y / spacingY);
        //let vector = this.grid[vectorYPos][vectorXPos];
        let y = (p.pos.y - this.cWidth / 2) / 100;
        let x = (p.pos.x - this.cHeight / 2) / 100;
        let vector = new Vector2D(Math.cos(y) * y, y);
        p.applyForce(vector);
        p.draw(this.ctx);
      } else {
        p.pos = this.randomPos();
      } 
    });
  }
  
  forEachVector(f: (x: Int, y: Int) => void) { 
    //Execute f(x,y) for each tile
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        f(j, i); 
      }
    }
  }

}

export {
  VectorField
};
