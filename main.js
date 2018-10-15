const MAX_Z = 5000;
const NUM_STARS = 100;
const VELOCITY = 5;

DOMRect.prototype.contains = function(r1) {
  return r1.left > this.left && r1.top > this.top &&
    r1.left < this.right && r1.top < this.bottom;
}

function Star() {
  this.x = 0;
  this.y = 0;
  this.z = MAX_Z;
  this.element = document.createElement('DIV');
  this.element.classList = "star";
}

Star.prototype.updateDOM = function() {
  const d = MAX_Z - this.z;
  const att = 400000.0 / (1.0 + 0.1 * d + 0.01 * d * d)
  const lum = Math.round(255 * att);
  
  this.element.style.transform = `translate3d(calc(${this.x}vw - 100%), calc(${this.y}vh - 100%), ${this.z}px)`;
  this.element.style.backgroundColor = `rgb(${lum}, ${lum}, ${lum})`;
  this.element.style.boxShadow = `0px 0px 4px 1px rgb(${lum}, ${lum}, ${lum})`;
}

Star.prototype.spawn = function() {
  this.z = -10 * MAX_Z + Math.random() * 11 * MAX_Z;
  let d = MAX_Z - this.z;
  this.x = -d * 0.05 + Math.random() * d * 0.1;
  this.y = -d * 0.05 + Math.random() * d * 0.1;

  this.updateDOM();
}

Star.prototype.move = function(xv, yv, zv) {
  this.x += xv;
  this.y += yv;
  this.z += zv;
  this.updateDOM();
}

Star.prototype.isActive = function() {
  const parentRect = this.element.parentElement.getBoundingClientRect();
  return this.z < MAX_Z && parentRect.contains(this.element.getBoundingClientRect());
}

let root = document.querySelector('.space');
let stars = [];
for (let i = 0; i < NUM_STARS; i++) {
  let star = new Star();
  stars.push(star);
  root.appendChild(star.element);
}

function mainLoop() {
  stars.forEach(star => star.isActive() ? star.move(0, 0, VELOCITY) : star.spawn());
  window.requestAnimationFrame(mainLoop);
}

mainLoop();
