/**
 * Created by Administrator on 2016/5/4.
 */
var status;//合成那边状态  0能合成  1不能合成
var c_w=500,c_h=500;//涂鸦的宽高
window.onload = function(){
    var input = document.getElementById("file_input");
    var result = document.getElementById("result");
    var c=document.getElementById("myCanvas");
    if(typeof FileReader==='undefined'){
        result.innerHTML = "抱歉，你的浏览器不支持 FileReader";
        input.setAttribute('disabled','disabled');
    }else{
        input.addEventListener('change',function(){
            readFile(input,result,c,"pic");
        },false);
    }

    var input_two = document.getElementById("file_input_two");
    var result_two = document.getElementById("result_two");
    var c_two=document.getElementById("myCanvas_two");
    if(typeof FileReader==='undefined'){
        result_two.innerHTML = "抱歉，你的浏览器不支持 FileReader";
        input_two.setAttribute('disabled','disabled');
    }else{
        input_two.addEventListener('change',function(){
            readFile(input_two,result_two,c_two,"pic_two");
            document.getElementById("myCanvas_two").style.display = "inline";
            status = 0;
        },false);
    }
    //移动 缩放
    var canvas = document.getElementById("myCanvas")
    img_scale(canvas,"pic");       //缩放
    //img_move_scale(canvas,"pic");          //(画布 , div中图片的id)   移动缩放
    var canvas_two = document.getElementById("myCanvas_two");
    img_move_scale(canvas_two,"pic_two");   //移动缩放 (画布 , div中图片的id)
}
//
function readFile(input,result,c,id){   //(添加file的input , 放图片的div ， 画布 ， div中图片的id)
    var file = input.files[0];
    if(!/image\/\w+/.test(file.type)){
        alert("文件必须为图片！");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e){
        result.innerHTML = '<img src="'+this.result+'" id="'+id+'" alt=""/>'
        //var c=document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        var img=document.getElementById(id);
        //c.width = img.width;
        //c.height = img.height;
        //ctx.drawImage(img,0,0);

        if(img.width>img.height){
            c.width=500;
            c.height=img.height*500/img.width;
            c_w=500;
            c_h=img.height*500/img.width;
            ctx.drawImage(img,0,0,img.width,img.height,0,0,500,img.height*500/img.width);
        }
        else{
            c.height=500;
            c.width=img.width*500/img.height;
            c_h=500;
            c_w=img.width*500/img.height;
            ctx.drawImage(img,0,0,img.width,img.height,0,0,img.width*500/img.height,500);
        }
        //convertCanvasToImage();
        //var c_two=document.getElementById("myCanvas_two");
        //var ctx_two=c_two.getContext("2d");
        //ctx_two.drawImage(img,0,0);
    }
}
function showCanvas_three(){
    //alert(c_w+"--"+c_h);
    document.getElementById("myCanvas_three").width = c_w;
    document.getElementById("myCanvas_three").height = c_h;
    $("#myCanvas_three").slideToggle();
    $("#control-ops").toggle();
}
/* --------从这里开始--------- */
var alpha=255;
//透明度
function setAlpha(){
    alpha = $("#alphaValue").text();
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    var imgData=ctx.getImageData(0,0,c.width,c.height);
    for (var i=0;i<imgData.data.length;i+=4)
    {
        imgData.data[i]=imgData.data[i];
        imgData.data[i+1]=imgData.data[i+1];
        imgData.data[i+2]=imgData.data[i+2];
        imgData.data[i+3]=alpha;
    }
    ctx.putImageData(imgData,0,0);
}
//反色
function oppositeColor(){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    var imgData=ctx.getImageData(0,0,c.width,c.height);
    for (var i=0;i<imgData.data.length;i+=4)
    {
        imgData.data[i]=255-imgData.data[i];
        imgData.data[i+1]=255-imgData.data[i+1];
        imgData.data[i+2]=255-imgData.data[i+2];
        imgData.data[i+3]=alpha;
    }
    ctx.putImageData(imgData,0,0);
}
//
function img_scale(canvas,id){   //缩放
    var imgX = 0;
    var imgY = 0;
    var imgScale = 1;   //缩放比例
    canvas.onmousewheel=canvas.onwheel=function(event){//图片缩放
        //var pos=windowToCanvas(canvas,event.clientX,event.clientY);
        //event.wheelDelta=event.wheelDelta?event.wheelDelta:(event.deltaY*(-40));
        if(event.wheelDelta>0){
            imgScale*=2;
            //imgX=imgX*2-pos.x;
            //imgY=imgY*2-pos.y;
            canvas.width*=2;
            canvas.height*=2;
        }else{
            imgScale/=2;
            //imgX=imgX*0.5+pos.x*0.5;
            //imgY=imgY*0.5+pos.y*0.5;
            canvas.width/=2;
            canvas.height/=2;
        }
        drawImage(canvas,imgX,imgY,imgScale,id);
    }
}
//图片移动 缩放
function img_move_scale(canvas,id){     //(画布 , div中图片的id)
    var imgX = 0;
    var imgY = 0;
    var imgScale = 1;   //缩放比例
    canvas.onmousedown = function(event){       //图片移动
        var pos=windowToCanvas(canvas,event.clientX,event.clientY);
        canvas.onmousemove = function(event){
            canvas.style.cursor="move";
            var pos1=windowToCanvas(canvas,event.clientX,event.clientY);
            var x=pos1.x-pos.x;
            var y=pos1.y-pos.y;
            pos=pos1;
            imgX+=x;
            imgY+=y;
            //alert(imgX);
            drawImage(canvas,imgX,imgY,imgScale,id);
        }
        canvas.onmouseup=function(){
            canvas.onmousemove=null;
            canvas.onmouseup=null;
            canvas.style.cursor="default";
        }
    }
    canvas.onmousewheel=canvas.onwheel=function(event){//图片缩放
        var pos=windowToCanvas(canvas,event.clientX,event.clientY);
        event.wheelDelta=event.wheelDelta?event.wheelDelta:(event.deltaY*(-40));
        if(event.wheelDelta>0){
            imgScale*=2;
            imgX=imgX*2-pos.x;
            imgY=imgY*2-pos.y;
        }else{
            imgScale/=2;
            imgX=imgX*0.5+pos.x*0.5;
            imgY=imgY*0.5+pos.y*0.5;
        }
        drawImage(canvas,imgX,imgY,imgScale,id);
    }
}
function windowToCanvas(canvas,x,y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left - (bbox.width - canvas.width) / 2,
        y: y - bbox.top - (bbox.height - canvas.height) / 2
    };
}
function drawImage(canvas,imgX,imgY,imgScale,id){
    var context =canvas.getContext("2d");
    var img=document.getElementById(id);
    //alert(img.width);
    //alert(imgX);
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(img,0,0,img.width,img.height,imgX,imgY,img.width*imgScale,img.height*imgScale);
}


//撤销  其实就是重新读一遍数据
function restore(){
    var c = document.getElementById("myCanvas");
    var ctx =c.getContext("2d");
    var img=document.getElementById("pic");
    ctx.clearRect(0,0,c.width,c.height);
    if(img.width>img.height){
        c.width=500;
        c.height=img.height*500/img.width;
        c_w=500;
        c_h=img.height*500/img.width;
        ctx.drawImage(img,0,0,img.width,img.height,0,0,500,img.height*500/img.width);
    }
    else{
        c.height=500;
        c.width=img.width*500/img.height;
        c_h=500;
        c_w=img.width*500/img.height;
        ctx.drawImage(img,0,0,img.width,img.height,0,0,img.width*500/img.height,500);
    }
    //裁剪的box的宽高适应
    document.getElementById("cut_box").style.width = c_w+"px";
    document.getElementById("cut_box").style.height = c_h+"px";
    document.getElementById("cut_rect").style.width = c_w/2+"px";
    document.getElementById("cut_rect").style.height = c_h/2+"px";
}
//合成  保存
function mixup(){
    var c = document.getElementById("myCanvas");
    var ctx =c.getContext("2d");

    //alert(status);
    if(status==0){
        var c_two=document.getElementById("myCanvas_two");
        var result_two = document.getElementById("result_two");
        var src = c_two.toDataURL("image/png");
        result_two.innerHTML = '<img src="'+src+'" id="pic_two" alt=""/>';
        var pic_two = document.getElementById("pic_two");
        ctx.drawImage(pic_two,0,0);
        status=1;
    }
    //alert(status);
    var c_three = document.getElementById("myCanvas_three");
    var result_three = document.getElementById("result_three");
    var src_three = c_three.toDataURL("image/png");
    result_three.innerHTML = '<img src="'+src_three+'" id="pic_three" alt=""/>';
    var pic_three = document.getElementById("pic_three");
    ctx.drawImage(pic_three,0,0);
    convertCanvasToImage();

}
//保存成图片
function convertCanvasToImage() {
    var result = document.getElementById("result");
    var canvas = document.getElementById("myCanvas");
//            var image = new Image();
//            image.src = canvas.toDataURL("image/png");
    var src = canvas.toDataURL("image/png");
    result.innerHTML = '<img src="'+src+'" id="pic" alt=""/>';
    $("#link_img").html("<a target='_blank' href='"+src+"'>下载</a>") ;
    document.getElementById("myCanvas_two").style.display = "none"; //转成图片后去掉第二个canvas
    //return image;
}
//灰度化
function grey(){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    var imgData=ctx.getImageData(0,0,c.width,c.height);
    for (var i=0;i<imgData.data.length;i+=4)
    {
        var sum = (imgData.data[i]+imgData.data[i+1]+imgData.data[i+2])/3;
        imgData.data[i]=sum;
        imgData.data[i+1]=sum;
        imgData.data[i+2]=sum;
        imgData.data[i+3]=alpha;
    }
    ctx.putImageData(imgData,0,0)
}
//二值化
function binary(){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    var imgData=ctx.getImageData(0,0,c.width,c.height);
    for (var i=0;i<imgData.data.length;i+=4)
    {
        var sum = (imgData.data[i]+imgData.data[i+1]+imgData.data[i+2])/3;
        if(sum>100){
            imgData.data[i]=255;
            imgData.data[i+1]=255;
            imgData.data[i+2]=255;
            imgData.data[i+3]=alpha;
        }
        else{
            imgData.data[i]=0;
            imgData.data[i+1]=0;
            imgData.data[i+2]=0;
            imgData.data[i+3]=alpha;
        }
    }
    ctx.putImageData(imgData,0,0)
}
//模糊化
function fuzzy(){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    var imgData=ctx.getImageData(0,0,c.width,c.height);
    for (var i=4;i<imgData.data.length-4;i+=4)
    {
        var r = (imgData.data[i-4]+imgData.data[i]+imgData.data[i+4])/3;
        var g = (imgData.data[i-3]+imgData.data[i+1]+imgData.data[i+5])/3;
        var b = (imgData.data[i-2]+imgData.data[i+2]+imgData.data[i+6])/3;
        imgData.data[i]=r;
        imgData.data[i+1]=g;
        imgData.data[i+2]=b;
        imgData.data[i+3]=alpha;
    }
    ctx.putImageData(imgData,0,0)
}

//水平翻转
function flip_horizontal(){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    var img_data=ctx.getImageData(0,0,c.width,c.height);
    var x, y, p, i, i2, t;
    var h = img_data.height;
    var w = img_data.width;
    var w_2 = w / 2;
   // 将 img_data 的数据水平翻转
    for (y = 0; y < h; y ++) {
           for (x = 0; x < w_2; x ++) {
                 i = (y<<2) * w + (x<<2);
                 i2 = ((y + 1) << 2) * w - ((x + 1) << 2);
               for (p = 0; p < 4; p ++) {
                t = img_data.data[i + p];
                      img_data.data[i + p] = img_data.data[i2 + p];
                     img_data.data[i2 + p] = t;
                 }
               }
     	    }
    ctx.putImageData(img_data, 0, 0);
}
//垂直翻转
function flip_vertical(){
    flip_horizontal();
    rotate_clockwise();
    rotate_clockwise();
}
//顺旋转
function rotate_clockwise(){
    convertCanvasToImage();
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    c_w = c.height;
    var flag = c.width;
    c.width = c.height;
    document.getElementById("myCanvas_three").width = c.height;
    c.height = flag;
    document.getElementById("myCanvas_three").height = flag;

    ctx.clearRect(0,0,c.width,c.height);
    ctx.translate(c.width,0);   //旋转中心点
    ctx.rotate(90*Math.PI/180);
    var img=document.getElementById("pic");
    ctx.drawImage(img,0,0);
    convertCanvasToImage(); //保存canvas为图片
    ctx.translate(0, c.height);
    ctx.rotate(-90*Math.PI/180);
}
//逆旋转
function rotate_anticlockwise(){
    convertCanvasToImage();
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    c_w = c.height;
    var flag = c.width;
    c.width = c.height;
    document.getElementById("myCanvas_three").width = c.height;
    c.height = flag;
    document.getElementById("myCanvas_three").height = flag;

    ctx.clearRect(0,0,c.width,c.height);
    ctx.translate(0, c.height);   //画布移到c.width;
    ctx.rotate(-90*Math.PI/180);
    var img=document.getElementById("pic");
    ctx.drawImage(img,0,0);
    convertCanvasToImage(); //保存canvas为图片
    ctx.translate(c.width,0);
    ctx.rotate(-90*Math.PI/180);
}


//裁剪
var rect_left,rect_top;
var rect_width,rect_height;
$(document).ready(function(){
    $("#cut_btn").click(function(){
        rect_left = parseInt(document.getElementById("cut_rect").style.left);
        rect_top = parseInt(document.getElementById("cut_rect").style.top);
        //alert("left:"+rect_left+"----top:"+rect_top);
        rect_width = document.getElementById("cut_rect").clientWidth;
        rect_height = document.getElementById("cut_rect").clientHeight;
        //alert(rect_width+"---"+rect_height);

        var c=document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        var imgData=ctx.getImageData(rect_left,rect_top,rect_width,rect_height);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        c.width = rect_width;
        c.height = rect_height;
        c_w = rect_width;
        c_h = rect_height;
        ctx.putImageData(imgData,0,0);
        $("#cut_box").hide();
        convertCanvasToImage();//保存成图片
    })
})
$(document).ready(function(){
    $("#cut_show").click(function(){
        document.getElementById("cut_box").style.width = c_w+"px";
        document.getElementById("cut_box").style.height = c_h+"px";
        document.getElementById("cut_rect").style.width = c_w/2+"px";
        document.getElementById("cut_rect").style.height = c_h/2+"px";
        //定位
        document.getElementById("cut_rect").style.left = 0+"px";
        document.getElementById("cut_rect").style.top=0+"px";
        $("#cut_box").show();
    })
    $("#cut_hide").click(function(){
        $("#cut_box").hide();
    })
})

