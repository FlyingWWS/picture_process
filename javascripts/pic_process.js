window.onload = function(){
    var input = document.getElementById("file_input");
    if(typeof FileReader==='undefined'){
        result.innerHTML = "抱歉，你的浏览器不支持 FileReader";
        input.setAttribute('disabled','disabled');
    }else{
        input.addEventListener('change',readFile,false);
    }
}
function readFile(){
    var result = document.getElementById("result");
    var file = this.files[0];
    if(!/image\/\w+/.test(file.type)){
        alert("文件必须为图片！");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e){
        result.innerHTML = '<img src="'+this.result+'" id="pic" alt=""/>'
        var c=document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        var img=document.getElementById("pic");
        ctx.drawImage(img,0,0);

    }
}
function convertCanvasToImage() {
    var link_img = document.getElementById("link_img");
    var canvas = document.getElementById("myCanvas");
//            var image = new Image();
//            image.src = canvas.toDataURL("image/png");
    var src = canvas.toDataURL("image/png");
    result.innerHTML = '<img src="'+src+'" id="pic" alt=""/>'
    link_img.innerHTML = "<a id='download_link' target='_blank' href='"+src+"'>下载</a>";
    return image;
}