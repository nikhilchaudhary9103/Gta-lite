export class Camera {
  constructor(){
    this.x = 0; this.y = 0;
    this.smooth = 0.12;
  }
  update(player, canvas){
    // 3rd-person feeling: camera looks slightly ahead of movement
    const lookAhead = {x: player.vx*0.18, y: player.vy*0.18};
    const targetX = player.x + lookAhead.x;
    const targetY = player.y + lookAhead.y + 40; // keep player lower on screen
    this.x += (targetX - this.x) * this.smooth;
    this.y += (targetY - this.y) * this.smooth;
  }
}
