import {Input} from './input.js';
import {World} from './world.js';
import {Player} from './player.js';
import {Camera} from './camera.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize(){
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
addEventListener('resize', resize);
resize();

const input = new Input();
const world = new World();
const player = new Player(0, 0);
const camera = new Camera();

let last = performance.now();
function loop(now){
  const dt = Math.min(0.05, (now - last)/1000);
  last = now;

  // update
  player.update(dt, input, world);
  world.update(player);
  camera.update(player, canvas);

  // render
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  // apply camera transform
  ctx.translate(-camera.x + canvas.width/2/devicePixelRatio, -camera.y + canvas.height/2/devicePixelRatio);

  // draw ground grid
  world.render(ctx);

  // draw player
  player.render(ctx);

  ctx.restore();

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
