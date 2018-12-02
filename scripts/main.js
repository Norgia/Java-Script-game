const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight);

  window.requestAnimationFrame(animate);
}

animate();
