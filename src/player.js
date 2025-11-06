export class Player {
  constructor(x,y){
    this.x = x; this.y = y;
    this.speed = 220; // px/sec
    this.radius = 16;
    this.vx = 0; this.vy = 0;
  }

  update(dt, input, world){
    // joystick values: positive x = right, positive y = down
    let ix = Number(input.joy.x) || 0;
    let iy = Number(input.joy.y) || 0;
    // invert y so up is -1
    iy = iy;
    // normalize
    const len = Math.hypot(ix, iy);
    if(len > 1) { ix/=len; iy/=len; }
    // apply movement
    this.vx = ix * this.speed;
    this.vy = iy * this.speed;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    // jump button -> small visual effect (placeholder)
    if(input.buttons.jump){
      // example: slight bob
      this.y -= 1;
    }
  }

  render(ctx){
    // body shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + this.radius*0.8, this.radius*1.1, this.radius*0.5, 0, 0, Math.PI*2);
    ctx.fill();
    // player circle
    ctx.fillStyle = '#ffcc33';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();
    // face/direction indicator
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x+6, this.y-4, 6, 6);
  }
}
