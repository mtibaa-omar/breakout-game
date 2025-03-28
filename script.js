/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 150;
    this.height = 50;
    this.color = `hsl(${Math.random() * 359 + 1},100%,50%)`;
  }
  update(x) {
    this.x = x;
  }
  drawRect() {
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
class Particle {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 143;
    this.size = 40;
    this.count = 0;
    this.speedX = Math.random() * 15 - 7.5;
    this.speedY = Math.random() * 15 - 7.5;
    this.color = `hsl(${Math.random() * 359 + 1},100%,50%)`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x - this.size - 5 <= 0 || this.x + this.size + 5 >= canvas.width) {
      this.speedX = -this.speedX;
      this.count++;
    }
    if (this.y - this.size - 5 <= 0) {
      this.speedY = -this.speedY;
      this.count++;
    }
  }
  draw() {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.count, this.x, this.y);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
let blocksArray = [];
function initBlocks() {
  for (let j = 100; j < 201; j += 100) {
    for (let i = 100; i < canvas.width - 150; i += 200) {
      if (i + 150 <= canvas.width) blocksArray.push(new Block(i, j));
    }
  }
}
canvas.addEventListener("click", function deleteOnClick(e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  for (let index = 0; index < blocksArray.length; index++) {
    if (
      mouseX >= blocksArray[index].x &&
      mouseX <= blocksArray[index].x + 150 &&
      mouseY >= blocksArray[index].y &&
      mouseY <= blocksArray[index].y + 50
    )
      blocksArray.splice(index, 1);
  }
});

function handleBlocks() {
  for (let i = 0; i < blocksArray.length; i++) {
    const block = blocksArray[i];
    const distX = Math.abs(particle.x - (block.x + 75));
    const distY = Math.abs(particle.y - (block.y + 25));
    if (distX <= particle.size + 75 + 5 && distY <= particle.size + 25 + 5) {
      blocksArray.splice(i, 1);

      if (distX > distY) {
        particle.speedX = -particle.speedX;
      } else {
        particle.speedY = -particle.speedY;
      }

      i--;
    } else {
      block.drawRect();
    }
  }
}
initBlocks();
const mainBlock = new Block(canvas.width / 2 - 75, canvas.height - 100);

canvas.addEventListener("mousedown", function (event) {
  if (!started) started = true;
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  let isDragging = false;

  if (
    mouseX >= mainBlock.x &&
    mouseX <= mainBlock.x + 150 &&
    mouseY >= mainBlock.y &&
    mouseY <= mainBlock.y + 50
  ) {
    isDragging = true;

    function onMouseMove(event) {
      if (isDragging) {
        mainBlock.update(event.clientX - 75);
      }
    }

    function onMouseUp() {
      isDragging = false;
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
  }
});
const particle = new Particle();
window.addEventListener("keydown", function (e) {
  if (!started) started = true;

  if (e.key === "ArrowLeft") mainBlock.update(mainBlock.x - 10);
  else if (e.key === "ArrowRight") mainBlock.update(mainBlock.x + 10);
});
function handleMainBlock() {
  const halfWidth = mainBlock.width / 2;
  const halfHeight = mainBlock.height / 2;
  const dx = particle.x - (mainBlock.x + halfWidth);
  const dy = particle.y - (mainBlock.y + halfHeight);

  const overlapX = particle.size + halfWidth - Math.abs(dx);
  const overlapY = particle.size + halfHeight - Math.abs(dy);

  if (overlapX > 0 && overlapY > 0) {
    if (overlapX < overlapY) {
      particle.speedX *= -1;
      particle.x += dx > 0 ? overlapX : -overlapX;
    } else {
      particle.speedY *= -1;
      particle.y += dy > 0 ? overlapY : -overlapY;
    }
  }
}
let started = false;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBlocks();
  handleMainBlock();
  mainBlock.drawRect();
  if (started) particle.update();
  particle.draw();
  const animationFrameId = requestAnimationFrame(animate);
  if (particle.count >= 20 || particle.y + particle.size + 5 >= canvas.height) {
    document.getElementById("defeat").style.display = "block";
    cancelAnimationFrame(animationFrameId);
  } else if (blocksArray.length === 0) {
    document.getElementById("win").style.display = "block";
    cancelAnimationFrame(animationFrameId);
  }
}
animate();
