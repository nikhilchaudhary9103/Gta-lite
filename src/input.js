// Simple virtual joystick and button handler
export class Input {
  constructor(){
    this.joy = {x:0,y:0}; // normalized -1..1
    this.buttons = {jump:false, action:false};

    // init joystick DOM refs
    this.knob = document.getElementById('joystickKnob');
    this.base = document.getElementById('joystickBase');
    this.maxRadius = 36;
    this.active = false;

    this.base.addEventListener('pointerdown', this.start.bind(this));
    window.addEventListener('pointermove', this.move.bind(this));
    window.addEventListener('pointerup', this.end.bind(this));

    // buttons
    document.getElementById('btnJump').addEventListener('touchstart', e=>{ e.preventDefault(); this.buttons.jump = true; });
    document.getElementById('btnJump').addEventListener('touchend', e=>{ e.preventDefault(); this.buttons.jump = false; });
    document.getElementById('btnAction').addEventListener('touchstart', e=>{ e.preventDefault(); this.buttons.action = true; });
    document.getElementById('btnAction').addEventListener('touchend', e=>{ e.preventDefault(); this.buttons.action = false; });

    // keyboard fallback
    window.addEventListener('keydown', e=>{
      if(e.key==='w'||e.key==='ArrowUp') this.joy.y = -1;
      if(e.key==='s'||e.key==='ArrowDown') this.joy.y = 1;
      if(e.key==='a'||e.key==='ArrowLeft') this.joy.x = -1;
      if(e.key==='d'||e.key==='ArrowRight') this.joy.x = 1;
      if(e.key===' ') this.buttons.jump = true;
    });
    window.addEventListener('keyup', e=>{
      if(['w','a','s','d','ArrowUp','ArrowLeft','ArrowDown','ArrowRight'].includes(e.key)) { this.joy.x=0; this.joy.y=0; }
      if(e.key===' ') this.buttons.jump = false;
    });
  }

  start(e){
    this.active = true;
    this.updateFromEvent(e);
  }
  move(e){
    if(!this.active) return;
    this.updateFromEvent(e);
  }
  end(e){
    this.active = false;
    this.joy.x = 0; this.joy.y = 0;
    this.knob.style.transform = `translate(0px,0px)`;
  }
  updateFromEvent(e){
    const rect = this.base.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx,dy);
    const nx = dx / Math.max(dist,1);
    const ny = dy / Math.max(dist,1);
    const r = Math.min(dist, this.maxRadius);
    this.knob.style.transform = `translate(${nx*r}px, ${ny*r}px)`;
    this.joy.x = (dx/this.maxRadius).toFixed(2);
    this.joy.y = (dy/this.maxRadius).toFixed(2);
    // clamp
    this.joy.x = Math.max(-1, Math.min(1, this.joy.x));
    this.joy.y = Math.max(-1, Math.min(1, this.joy.y));
  }
}
