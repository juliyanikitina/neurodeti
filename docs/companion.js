import * as THREE from './assets/three.module.min.js';

const canvas = document.querySelector('#agent-canvas');
if (canvas) {
  try {
    const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(34,1,.1,50);camera.position.set(0,.55,7);
    scene.add(new THREE.HemisphereLight(0xf8ffe7,0x173b34,3));
    const key=new THREE.DirectionalLight(0xffefd3,5);key.position.set(-3,5,5);scene.add(key);
    const rim=new THREE.DirectionalLight(0x8af3d6,3);rim.position.set(3,1,-3);scene.add(rim);
    const ivory=new THREE.MeshStandardMaterial({color:0xf6f8ed,roughness:.3,metalness:.12});
    const mint=new THREE.MeshStandardMaterial({color:0x83c9ac,roughness:.35,metalness:.25});
    const black=new THREE.MeshStandardMaterial({color:0x102e29,roughness:.22,metalness:.3});
    const glow=new THREE.MeshStandardMaterial({color:0xd5f473,emissive:0x9dbb4c,emissiveIntensity:1.3,roughness:.2});
    const robot=new THREE.Group();scene.add(robot);
    function mesh(geometry,material,parent,x=0,y=0,z=0){const object=new THREE.Mesh(geometry,material);object.position.set(x,y,z);parent.add(object);return object;}
    const body=mesh(new THREE.SphereGeometry(.66,32,24),ivory,robot,0,-.18);body.scale.set(.83,1,.65);
    const head=mesh(new THREE.SphereGeometry(.76,40,28),ivory,robot,0,.83);head.scale.set(1,.78,.78);
    const face=mesh(new THREE.SphereGeometry(.65,32,20),black,robot,0,.84,.28);face.scale.set(.93,.62,.63);
    for(const x of [-.24,.24]){const eye=mesh(new THREE.SphereGeometry(.075,16,12),glow,robot,x,.9,.667);eye.scale.set(1,1.3,.45);}
    const smile=new THREE.CatmullRomCurve3([new THREE.Vector3(-.12,.72,.683),new THREE.Vector3(0,.68,.7),new THREE.Vector3(.12,.72,.683)]);
    mesh(new THREE.TubeGeometry(smile,20,.018,8,false),glow,robot);
    mesh(new THREE.TorusGeometry(.19,.045,12,32),mint,robot,0,-.1,.425);
    mesh(new THREE.SphereGeometry(.145,24,16),glow,robot,0,-.1,.43).scale.z=.3;
    const left=new THREE.Group();left.position.set(-.57,.1,0);left.rotation.z=-.4;robot.add(left);
    mesh(new THREE.CapsuleGeometry(.14,.4,6,16),ivory,left,0,-.28);
    mesh(new THREE.SphereGeometry(.16,16,12),mint,left,0,-.62);
    const right=new THREE.Group();right.position.set(.57,.1,0);right.rotation.z=1;robot.add(right);
    mesh(new THREE.CapsuleGeometry(.14,.4,6,16),ivory,right,0,-.28);
    mesh(new THREE.SphereGeometry(.16,16,12),mint,right,0,-.62);
    for(const x of [-.28,.28]){mesh(new THREE.CapsuleGeometry(.18,.25,6,16),ivory,robot,x,-.94);const foot=mesh(new THREE.SphereGeometry(.23,20,14),mint,robot,x,-1.19,.1);foot.scale.set(1,.5,1.4);}
    mesh(new THREE.CylinderGeometry(.045,.045,.18,12),mint,robot,0,1.45);
    mesh(new THREE.SphereGeometry(.08,16,12),glow,robot,0,1.56);
    const halo=mesh(new THREE.TorusGeometry(1.17,.012,6,80),glow,scene,0,-1.43);halo.rotation.x=Math.PI/2;
    const orbit=mesh(new THREE.TorusGeometry(1.7,.008,6,100),mint,scene,0,.1,-.4);orbit.rotation.set(.5,.35,.25);
    const stars=new THREE.Group();scene.add(stars);
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2;mesh(new THREE.SphereGeometry(.022,8,6),glow,stars,Math.cos(a)*1.72,Math.sin(a)*1.4,.1+Math.sin(a)*.4);}
    let visible=false,paused=document.body.classList.contains('no-motion'),last=0,rotation=-.16,dragging=false,start=0;
    function render(time=0){
      if(!visible||document.hidden||time-last<33)return;last=time;
      if(!paused&&!dragging){robot.position.y=Math.sin(time*.0012)*.055;right.rotation.z=1+Math.sin(time*.0016)*.1;stars.rotation.z=time*.000035;}
      robot.rotation.y=rotation;renderer.render(scene,camera);
    }
    function loop(){renderer.setAnimationLoop(visible&&!paused&&!document.hidden?render:null);if(visible)render(last+40);}
    new ResizeObserver(()=>{const r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();render(last+40);}).observe(canvas);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;loop();},{rootMargin:'100px'}).observe(canvas);
    document.addEventListener('motionchange',e=>{paused=e.detail;loop();});document.addEventListener('visibilitychange',loop);
    canvas.addEventListener('pointerdown',e=>{dragging=true;start=e.clientX;canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(dragging){rotation+=(e.clientX-start)*.012;start=e.clientX;render(last+40);}});
    canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
    canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();rotation+=(e.key==='ArrowLeft'?-.2:.2);render(last+40);}});
    document.querySelectorAll('[data-agent]').forEach(button=>button.addEventListener('click',()=>{const colors={writer:0xd5f473,artist:0xf3c285,coder:0x93dbed,tester:0xa6ead1};glow.color.setHex(colors[button.dataset.agent]);glow.emissive.copy(glow.color);render(last+40);}));
    canvas.parentElement.classList.add('model-ready');
    canvas.addEventListener('webglcontextlost',()=>{renderer.setAnimationLoop(null);canvas.parentElement.classList.remove('model-ready');});
  } catch {
    // The role buttons and a static idea badge remain usable without WebGL.
    canvas.hidden=true;
  }
}
