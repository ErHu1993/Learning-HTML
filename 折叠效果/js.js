

$(document).ready(function () {

    var ps = document.getElementsByTagName("p");
    for (var i = 0; i < ps.length; i++) {
        var element = ps[i];
        element.onclick=function(){
            if(this.nextSibling.nextSibling.style.display=='none'){
                this.nextSibling.nextSibling.style.display='block';
            }else{
                this.nextSibling.nextSibling.style.display='none';
            }
        }
    }

    // $(".menu p").on('click', function () {
    //     if($(this).siblings().css("display")=='none'){
    //         $(this).siblings().show();
    //     }else{
    //         $(this).siblings().hide();
    //     }
    // });
});