/**
 * Created by Administrator on 2016/5/4.
 */
$(document).ready(function(){
    $(".layout_operate dt a").click(function(){
        $(".layout_operate ul li dl dd").slideToggle();
    });
});

function progressBar_move(event){
    var x = event.offsetX;
    $(".progressPoint").css("left",x);
}

