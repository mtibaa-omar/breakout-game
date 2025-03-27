/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
class Particle {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 50;
    this.count = 0;
    this.speedX = Math.random() * 15 - 7.5;
    this.speedY = Math.random() * 15 - 7.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x - this.size - 5 <= 0 || this.x + this.size + 5 >= canvas.width) {
      this.speedX = -this.speedX;
      this.count++;
    }
    if (
      this.y - this.size - 5 <= 0 ||
      this.y + this.size + 5 >= canvas.height
    ) {
      this.speedY = -this.speedY;
      this.count++;
    }
  }
  draw() {
    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "white";
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.count, this.x, this.y);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.stroke();
  }
}
const particle = new Particle();
console.log(particle);
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particle.update();
  particle.draw();
  requestAnimationFrame(animate);
}
animate();
