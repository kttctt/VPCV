
        // svg の内容
        var bodyspace = document.getElementById("bodyspace");
        var space = Snap("#space");//.remove();

        VPCV.fieldInit(space);

        var rectStage = Snap().remove();
        var rect = rectStage.rect(0,0, 100, 100).drag();
        rect.attr({fill:"#000"});
        rectStage.appendTo(space);

        var circleStage = Snap().remove();
        //circleStage.attr({viewBox:[0,0,300,300]})
        circleStage.circle(100,100,80).attr(
                {fill:"red", stroke:"orange" ,strokeWidth:30}).drag();
        circleStage.appendTo(space)

var MyVideo = new Video_CLASS("first", "video", 320, 240, true, false);
        VPCV.playIcon(space, MyVideo);



VPCV.readDefault(40,100,"Hello!","group0",function(g){space.append(g);});
VPCV.readDefault(80,300,"World!","group1",function(g){space.append(g);});
VPCV.readDefault(120,400,"Yeah!","group2",function(g){
  space.append(g);
  g.select("rect").attr({fill:"#0ff"});
});

//for(i=3;i<6;i=i+1){
//  VPCV.readDefaultAjax(0,30*i,"default","group"+i,function(g){space.append(g);});
//}

VPCV.imageNode("./lena.jpg",256,256,0,0,function(paper,inputImage,canvas){
space.append(paper);
});


VPCV.camNode(320,240,"cam1",function(paper){
space.append(paper);
});


          setTimeout(function(){
           VPCV.position["cam1"].height = 320/MyVideo.getVideoSize().width*MyVideo.getVideoSize().height;
/*            space.select("#group0").dblclick(function(e){
                
                var inputImage = nega(paperJPG, canvas, ctx, inputImage, orig_x, orig_y, img);
                inputImage.drag(
                function(dx, dy){
                    inputImage.attr({x: orig_x+dx,y: orig_y+dy});
                },function(x,y){
                    orig_x= +this.attr("x");
                    orig_y= +this.attr("y");
                },function(){
                }
                );
                //input = window.prompt("input test", "");
                //if(input)this.attr({text:input});
              }).touchend(function(e){
          if(paperJPGtouched){
                
                var inputImage = nega(paperJPG, canvas, ctx, inputImage, orig_x, orig_y, img);
                inputImage.drag(
                function(dx, dy){
                    inputImage.attr({x: orig_x+dx,y: orig_y+dy});
                },function(x,y){
                    orig_x= +this.attr("x");
                    orig_y= +this.attr("y");
                },function(){
                });
                //input = window.prompt("input test", "");
                //if(input)this.attr({text:input});
                paperJPGtouched = false;
          }else{
            paperJPGtouched=true;
            setTimeout(function(){paperJPGtouched=false;},350);
          }
        });

            space.select("#group1").dblclick(function(e){
                
                var inputImage = resetData(paperJPG, canvas, ctx, inputImage, orig_x, orig_y, img);
                inputImage.drag(
                function(dx, dy){
                    inputImage.attr({x: orig_x+dx,y: orig_y+dy});
                },function(x,y){
                    orig_x= +this.attr("x");
                    orig_y= +this.attr("y");
                },function(){
                }
                );
                //input = window.prompt("input test", "");
                //if(input)this.attr({text:input});
              }).touchend(function(e){
                if(paperJPGtouched){
                
                var inputImage = resetData(paperJPG, canvas, ctx, inputImage, orig_x, orig_y, img);
                inputImage.drag(
                function(dx, dy){
                    inputImage.attr({x: orig_x+dx,y: orig_y+dy});
                },function(x,y){
                    orig_x= +this.attr("x");
                    orig_y= +this.attr("y");
                },function(){
                });
                //input = window.prompt("input test", "");
                //if(input)this.attr({text:input});
                paperJPGtouched = false;
               }else{
                paperJPGtouched=true;
                setTimeout(function(){paperJPGtouched=false;},350);
              }
            });

            //alert(space.select("#group2"));

              var inputImage = resetData(paperJPG, canvas, ctx, inputImage, orig_x, orig_y, img);
                inputImage.drag(
                function(dx, dy){
                    inputImage.attr({x: orig_x+dx,y: orig_y+dy});
                },function(x,y){
                    orig_x= +this.attr("x");
                    orig_y= +this.attr("y");
                },function(){
                }
                );
          //},10000);

*/
//window.onload = function(){

  space.prependTo(bodyspace);
//MyVideo.stopVideo();

//var filterTest;
//アニメーションを繰り返す処理
function animeloop(){
    MyVideo.anime(video_canvas);
    /*if(video_graymode){
        var vctx = video_canvas.getContext("2d");
        var src = vctx.getImageData(0, 0, video_canvas.width, video_canvas.height);
        var dst = vctx.createImageData(video_canvas.width, video_canvas.height);

            //ネガポジ変換
            for (var i = 0; i < src.data.length; i=i+4) {
                dst.data[i]   = 255 - src.data[i];    //R
                dst.data[i+1] = 255 - src.data[i+1];  //G
                dst.data[i+2] = 255 - src.data[i+2];  //B
                dst.data[i+3] = src.data[i+3];        //A
            }

            vctx.putImageData(dst, 0,0);
     }*/
    // この方式では メモリリークしてしまう・・・
    //Snap.release(filterTest.remove());
//    filterTest = paperVIDEO.filter(Snap.format('\<feImage xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{url}" x="{xx}" y="{yy}" width="320" height="240"/>', {
//            xx:video_x+video_dx,
//            yy:video_y+video_dy,
//            url:video_canvas.toDataURL()
//    }));
//    inputVIDEO.attr({filter:filterTest});
    requestAnimationFrame(animeloop);
};

//alert("START!");
console.log("VPCV.connect");
console.log(VPCV.connect);
console.log("VPCV.node");
console.log(VPCV.node);
console.log("VPCV.arrow");
console.log(VPCV.arrow);
console.log("VPCV.position");
console.log(VPCV.position);
console.log("START!");
animeloop();

},10000);