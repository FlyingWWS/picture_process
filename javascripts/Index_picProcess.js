/**
 * Created by Administrator on 2016/5/4.
 */
window.onload = function(){
    var input = document.getElementById("file_input");
    var result = document.getElementById("result");
    var c=document.getElementById("myCanvas");
    if(typeof FileReader==='undefined'){
        result.innerHTML = "抱歉，你的浏览器不支持 FileReader";
        input.setAttribute('disabled','disabled');
    }else{
        input.addEventListener('change',function(){readFile(input,result,c,"pic")},false);
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
        },false);
    }
    //移动 缩放
    var canvas = document.getElementById("myCanvas");
    img_move_scale(canvas,"pic");          //(画布 , div中图片的id)
    var canvas_two = document.getElementById("myCanvas_two");
    img_move_scale(canvas_two,"pic_two");
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
        ctx.drawImage(img,0,0);
        //if(img.width>img.height){
        //    c.width=500;
        //    c.height=img.height*500/img.width;
        //    ctx.drawImage(img,0,0,img.width,img.height,0,0,500,img.height*500/img.width);
        //}
        //else{
        //    c.height=500;
        //    c.width=img.width*500/img.height;
        //    ctx.drawImage(img,0,0,img.width,img.height,0,0,img.width*500/img.height,500);
        //}
        //convertCanvasToImage();
        //var c_two=document.getElementById("myCanvas_two");
        //var ctx_two=c_two.getContext("2d");
        //ctx_two.drawImage(img,0,0);
    }
}
function convertCanvasToImage() {
    var link_img = document.getElementById("link_img");
    var result = document.getElementById("result");
    var canvas = document.getElementById("myCanvas");
//            var image = new Image();
//            image.src = canvas.toDataURL("image/png");
    var src = canvas.toDataURL("image/png");
    result.innerHTML = '<img src="'+src+'" id="pic" alt=""/>';
    link_img.innerHTML = "<a target='_blank' href='"+src+"'>下载</a>";
    document.getElementById("myCanvas_two").style.display = "none"; //转成图片后去掉第二个canvas
    //return image;
}

/* --------从这里开始--------- */
function save_my(){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.save();
}
function restore_my(){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.restore();
}
//透明度
function setAlpha(){
    var alpha = document.getElementById("alpha_text").value;
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
    var alpha = document.getElementById("alpha_text").value;
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

//合成
function mixup(){
    var c = document.getElementById("myCanvas");
    var ctx =c.getContext("2d");

    var c_two=document.getElementById("myCanvas_two");
    var result_two = document.getElementById("result_two");
    var src = c_two.toDataURL("image/png");
    result_two.innerHTML = '<img src="'+src+'" id="pic_two" alt=""/>';
    var pic_two = document.getElementById("pic_two");
    ctx.drawImage(pic_two,0,0);
    convertCanvasToImage();
}

//灰度化
function grey(){
    var alpha = document.getElementById("alpha_text").value;
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
    var alpha = document.getElementById("alpha_text").value;
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
//旋转
function rotate(){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    ctx.translate(500,0);
    ctx.rotate(90*Math.PI/180);
    var img=document.getElementById("pic");
    ctx.drawImage(img,0,0);
    convertCanvasToImage(); //保存canvas为图片
    ctx.translate(0,500);
    ctx.rotate(-90*Math.PI/180);
}
