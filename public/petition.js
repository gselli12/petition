const button = document.querySelector("button");
const canvas = document.querySelector("canvas");
let context = canvas.getContext('2d');

let x = 0;
let y = 0;


button.addEventListener("click", () => {
    $("#hidden").val(canvas.toDataURL());
    // console.log($("#first-name").val());
    // console.log($("#last-name").val());
    // console.log($("#hidden").val());
});

var position = (e) => {
    x = e.offsetX;
    y = e.offsetY;
};

canvas.addEventListener("mousedown", (e) => {
    position(e);
});

canvas.addEventListener("mouseenter", (e) => {
    position(e);
});


canvas.addEventListener("mousemove", (e) => {
    if(e.buttons != 1) return;

    context.beginPath();
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    context.lineCap = 'round';

    context.moveTo(x ,y);
    position(e);
    context.lineTo(x , y);

    context.stroke();
});
