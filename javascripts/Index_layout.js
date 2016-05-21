/**
 * Created by Administrator on 2016/5/4.
 */
$(document).ready(function(){
    $(".layout_operate dt a").click(function(){
        $(".layout_operate ul li dl dd").slideToggle();
    });
});
//透明度的
function progressBar_move(event){
    var x = event.offsetX;
    $("#progressPoint").css("left",x);
    $("#alphaValue").text(x+50);
    setAlpha();
}

/*涂鸦-------下面-------*/
function showCanvas_three(){
    $("#myCanvas_three").slideToggle();
    $("#control-ops").toggle();
}
var mousePressed = false;
var lastX, lastY;
var ctx;
$(document).ready(function(){
    ctx = document.getElementById('myCanvas_three').getContext("2d");

    $('#myCanvas_three').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas_three').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas_three').mouseup(function (e) {
        mousePressed = false;
    });
    $('#myCanvas_three').mouseleave(function (e) {
        mousePressed = false;
    });
})

function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = $('#selColor').val();
        ctx.lineWidth = $('#selWidth').val();
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}
function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
/*涂鸦---------上面-----------*/
