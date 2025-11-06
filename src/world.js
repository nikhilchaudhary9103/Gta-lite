// Chunk-based simple world with trees generated deterministically
const CHUNK = 512;
const TREES_PER_CHUNK = 24;

function seedRandom(seed){
  // simple LCG
  return function(){
    seed = (1664525*seed + 1013904223) | 0;
    return ((seed >>> 0) / 4294967295);
  }
}

export class World {
  constructor(){
    this.chunks = new Map(); // key "cx,cy" -> chunk data
    this.visibleRadius = 2;
  }

  key(cx,cy){ return `${cx},${cy}`; }

  update(player){
    const cx = Math.floor(player.x / CHUNK);
    const cy = Math.floor(player.y / CHUNK);
    // load nearby chunks
    for(let dx=-this.visibleRadius; dx<=this.visibleRadius; dx++){
      for(let dy=-this.visibleRadius; dy<=this.visibleRadius; dy++){
        const k = this.key(cx+dx, cy+dy);
        if(!this.chunks.has(k)){
          this.chunks.set(k, this.generateChunk(cx+dx, cy+dy));
        }
      }
    }
    // unload far chunks
    for(const k of Array.from(this.chunks.keys())){
      const [ccx, ccy] = k.split(',').map(Number);
      if(Math.abs(ccx-cx) > this.visibleRadius || Math.abs(ccy-cy) > this.visibleRadius){
        this.chunks.delete(k);
      }
    }
  }

  generateChunk(cx,cy){
    const rnd = seedRandom(cx*73856093 ^ cy*19349663);
    const trees = [];
    for(let i=0;i<TREES_PER_CHUNK;i++){
      const rx = Math.floor(rnd()*CHUNK);
      const ry = Math.floor(rnd()*CHUNK);
      trees.push({x: cx*CHUNK + rx, y: cy*CHUNK + ry, size: 20 + Math.floor(rnd()*20)});
    }
    return {cx,cy,trees};
  }

  render(ctx){
    // draw grid background
    const minX = -10000, minY = -10000;
    // draw chunks and trees
    for(const chunk of this.chunks.values()){
      // optional: draw chunk border
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.strokeRect(chunk.cx*CHUNK, chunk.cy*CHUNK, CHUNK, CHUNK);
      // trees
      for(const t of chunk.trees){
        ctx.fillStyle = '#2f7a2f';
        ctx.beginPath();
        ctx.ellipse(t.x, t.y, t.size/2, t.size, 0, 0, Math.PI*2);
        ctx.fill();
        // trunk
        ctx.fillStyle = '#5c3a21';
        ctx.fillRect(t.x-2, t.y, 4, t.size*0.8);
      }
    }
  }
}
