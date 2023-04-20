// app.js
const imageFile = document.getElementById("imageFile");
const imageCanvas = document.getElementById("imageCanvas");
const ctx = imageCanvas.getContext("2d");
const downloadJSON = document.getElementById("downloadJSON");
const imageContainer = document.getElementById("imageContainer");

const gridSizeInput = document.getElementById("gridSize");
const showGridCheckbox = document.getElementById("showGrid");

function drawGrid(gridSize) {
  if (!showGridCheckbox.checked) return;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
  for (let x = 0; x <= imageCanvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, imageCanvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= imageCanvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(imageCanvas.width, y);
    ctx.stroke();
  }
}

let image = new Image();
let isDrawing = false;
let rectangles = [];

imageFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    image.src = event.target.result;
    image.onload = () => {
      imageCanvas.width = image.width;
      imageCanvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      drawGrid(parseInt(gridSizeInput.value));
    };
  };

  reader.readAsDataURL(file);
});

imageCanvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const rect = {
    x: e.clientX - imageCanvas.getBoundingClientRect().left,
    y: e.clientY - imageCanvas.getBoundingClientRect().top,
    width: 0,
    height: 0,
  };
  rectangles.push(rect);
});

imageCanvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) {
    const x = e.clientX - imageCanvas.getBoundingClientRect().left;
    const y = e.clientY - imageCanvas.getBoundingClientRect().top;
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    ctx.drawImage(image, 0, 0);
    drawGrid(parseInt(gridSizeInput.value));
    ctx.fillStyle = "black";
    ctx.fillText(`(${x}, ${y})`, x + 5, y - 5);
    return;
  }

  const rect = rectangles[rectangles.length - 1];
  rect.width = e.clientX - imageCanvas.getBoundingClientRect().left - rect.x;
  rect.height = e.clientY - imageCanvas.getBoundingClientRect().top - rect.y;

  ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  ctx.drawImage(image, 0, 0);
  ctx.strokeStyle = "hotpink"; // Set the stroke color to hotpink
  rectangles.forEach((rect) => {
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  });
});

imageCanvas.addEventListener("mouseup", async (e) => {
  isDrawing = false;

  const name = prompt("Enter a name for the selection:");
  if (!name) {
    alert("Invalid name. Discarding the selection.");
    rectangles.pop();
  } else {
    const uniqueName = getUniqueName(name);
    if (name !== uniqueName) {
      alert(`Name collision. Saving as "${uniqueName}" instead.`);
    }
    rectangles[rectangles.length - 1].name = uniqueName;
  }
});

downloadJSON.addEventListener("click", () => {
  const json = JSON.stringify(rectangles);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "rectangles.json";
  link.click();
});

gridSizeInput.addEventListener("change", () => {
  ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  ctx.drawImage(image, 0, 0);
  drawGrid(parseInt(gridSizeInput.value));
});

showGridCheckbox.addEventListener("change", () => {
  ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  ctx.drawImage(image, 0, 0);
  drawGrid(parseInt(gridSizeInput.value));
});
