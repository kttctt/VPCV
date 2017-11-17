/*
 * VPCV
 * Visual Programming for Computer Vision
 * 2015/07/01 start
 * 2015/07/16 
 * Tabata S
 *
 */
var VPCV = (function () {
 
  var version = {
    release: '0.0.1',
    date:    '2015-07-01'
  };

  // private function

  myPrivateMethod = function( foo ) {
      console.log( foo );
  };

var touchsupport = ('ontouchstart' in window); //タッチイベントの切り替え判定

  //*******************//
  //  set Arrow Stage  //
  //*******************//
  var arrowStage = Snap().remove();
  var markerShape = arrowStage.path("M0,0L8,5L0,10L4,5z");
  var marker = markerShape.marker(0,0,10,10,5,5).attr({
                      markerUnits: "userSpaceOnUse",
                      markerWidth: 60,
                      markerHeight: 60,
                      orient:"auto-start-reverse"
                    });
  markerShape = null;
  // public function

  var exports = {arrowStage, marker}; 
  // hash for arrow
  exports.arrow = {};
  // hash for node
  exports.node = {};
  // hash for node connection
  exports.connect = {};
  // hash for signal
  exports.signal = {};
  // hash for param
  exports.param = {};
  // hash for position
  exports.position = {};
  // click node
  exports.clickedNode = null;
  // arrow offset
  exports.offsetStart = 20;
  exports.offsetEnd = 30;
  // click color
  exports.clickColor = "red";

  var self = exports;
  console.log(self);

  exports.versionEcho = function(){
      return "version " + version.release + ", released " + version.date;
  };

  //***************//
  //  Field init  //
  //***************//
  exports.fieldInit = function(space, opt_color) {
    var initColor = opt_color || "#f0ffff";
    var backStage = Snap().remove();
    backStage.rect(0,0, 100, 100).attr({width:"100%",height:"100%",fill:initColor});
    backStage.prependTo(space);
    arrowStage.appendTo(space);
    backStage = null;
    space = null;
  }

  //*************************//
  //  read default.svg file  //
  //*************************//
  exports.readDefault = function(x,y,title,id,callback) {
    var g;
    self.param[id] = {x:x,y:y,dx:0,dy:0,origTransform:null};
    Snap.load("default.svg", function(fg){
      g = fg.select("g");
        var text = g.select("text").attr({text:title});
      //console.log(g.select("rect").node.width.baseVal.value);
      //console.log(g.select("rect").node.height.baseVal.value);
      self.position[id] = {x:x,y:y,width:g.select("rect").node.width.baseVal.value,height:g.select("rect").node.height.baseVal.value};
      //g.add(Snap().rect(0,0,g.select("rect").node.width.baseVal.value,g.select("rect").node.height.baseVal.value).attr({fill:"none",stroke:"black"}));
          var box = g.select("rect").attr({fill:"#0078ff"});
          if(touchsupport){
            text.touchend(function(e){
              if(self.signal[id]){
                input = window.prompt("input test", "");
                if(input)this.attr({text:input});
              }else{
                self.signal[id]=true;
                setTimeout(function(){self.signal[id]=false;},350);
              }
            });
            box.touchend(function(e){
              if(self.clickedNode==null){
                self.node[id].attr({stroke:self.clickColor,strokeWidth:5});
                self.clickedNode = id;
              }else if(self.clickedNode==id){
                self.node[id].attr({stroke:"none"});
                self.clickedNode = null;
              }else{
                self.node[self.clickedNode].attr({stroke:"none"});
                for(key in self.connect){
                  if(self.connect[key][id] && self.connect[key][id] != "reverse"){
                    self.arrow[self.connect[key][id]].remove();
                    self.arrow[self.connect[key][id]] = null;
                    delete self.connect[key][id];
                    delete self.connect[id][key];
                  }
                }
                self.connect[self.clickedNode][id]=self.clickedNode+"_to_"+id;
                self.connect[id][self.clickedNode]="reverse";
                if(self.arrow[id+"_to_"+self.clickedNode] ){
                  self.arrow[id+"_to_"+self.clickedNode].remove();
                  self.arrow[id+"_to_"+self.clickedNode] = null;
                }
                if(self.arrow[self.clickedNode+"_to_"+id] == null){
                  self.arrowMakerById(self.clickedNode,id,self.clickedNode+"_to_"+id);
                }
                self.clickedNode = null;
              }
            });
          } else {
            text.dblclick(function(e){
              input = window.prompt("input test", "");
              if(input)this.attr({text:input});
            });
            box.click(function(e,x,y){
              if(self.clickedNode==null){
                self.node[id].attr({stroke:self.clickColor,strokeWidth:5});
                self.clickedNode = id;
              }else if(self.clickedNode==id){
                self.node[id].attr({stroke:"none"});
                self.clickedNode = null;
              }else{
                self.node[self.clickedNode].attr({stroke:"none"});
                for(key in self.connect){
                  if(self.connect[key][id] && self.connect[key][id] != "reverse"){
                    self.arrow[self.connect[key][id]].remove();
                    self.arrow[self.connect[key][id]] = null;
                    delete self.connect[key][id];
                    delete self.connect[id][key];
                  }
                }
                self.connect[self.clickedNode][id]=self.clickedNode+"_to_"+id;
                self.connect[id][self.clickedNode]="reverse";
                if(self.arrow[id+"_to_"+self.clickedNode] ){
                  self.arrow[id+"_to_"+self.clickedNode].remove();
                  self.arrow[id+"_to_"+self.clickedNode] = null;
                }
                if(self.arrow[self.clickedNode+"_to_"+id] == null){
                  self.arrowMakerById(self.clickedNode,id,self.clickedNode+"_to_"+id);
                }
                self.clickedNode = null;
              }
            });
          }
      var matrix = Snap.matrix().translate(x,y);
      var transformString = matrix.toTransformString();
      g.attr({id:id}).transform(transformString);
      g.drag(
            function(dx, dy){
              this.attr({transform: self.param[id].origTransform + (self.param[id].origTransform ? "T" : "t") + [dx,dy]});
              self.position[id].x = self.param[id].x+dx;
              self.position[id].y = self.param[id].y+dy;
              self.param[id].dx = dx;
              self.param[id].dy = dy;
              for(key in self.connect[id]){
                self.arrowUpdate(self.connect[id][key], id, key); 
              }
            },function(x,y){
              self.param[id].origTransform = this.transform().local;
              self.param[id].dx = 0;
              self.param[id].dy = 0;
            },function(){
              self.param[id].x = self.param[id].x + self.param[id].dx;
              self.param[id].y = self.param[id].y + self.param[id].dy;
            }
          );

      self.connect[id]={};
      self.signal[id]=false;
      self.node[id]=g;
      callback(g);
      g = null;
      text = null;
      box = null;
      matrix = null;
      transformString = null;;
    });
  };

  //******************************//
  //  read default_ajax.svg file  //
  //******************************//
  exports.readDefaultAjax = function(x,y,title,id,callback) {
    self.param[id] = {x:x,y:y,dx:0,dy:0,origTransform:null};
    Snap.ajax("test_home.svg",// {key: "value"}, //省略可
      function(request){
        var svg = Snap(request.responseXML.documentElement).attr({style:"display:none;"});
          var g = svg.g();
          self.position[id] = {x:x,y:y,width:svg.select("#rect4800").node.width.baseVal.value,height:svg.select("#rect4800").node.height.baseVal.value};
          var matrix = Snap.matrix().translate(x,y);
          var transformString = matrix.toTransformString();
          g.attr({id:name}).transform(transformString);
          g.add(svg.select("#rect4800")).add(svg.select("#text4810"));
          g.drag(
            function(dx, dy){
              this.attr({transform: self.param[id].origTransform + (self.param[id].origTransform ? "T" : "t") + [dx,dy]});
              self.position[id].x = self.param[id].x+dx;
              self.position[id].y = self.param[id].y+dy;
              self.param[id].dx = dx;
              self.param[id].dy = dy;
              for(key in self.connect[id]){
                self.arrowUpdate(self.connect[id][key], id, key); 
              }
            },function(x,y){
              self.param[id].origTransform = this.transform().local;
              self.param[id].dx = 0;
              self.param[id].dy = 0;
            },function(){
              self.param[id].x = self.param[id].x + self.param[id].dx;
              self.param[id].y = self.param[id].y + self.param[id].dy;
            }
          );
          if(touchsupport){
            g.select("#text4810").attr({text:title}).touchend(function(e){
              if(self.signal[id]){
                input = window.prompt("input test", "");
                if(input)this.attr({text:input});
              }else{
                self.signal[id]=true;
                setTimeout(function(){self.signal[id]=false;},350);
              }
            });
            g.select("#rect4800").touchend(function(e){
              if(self.clickedNode==null){
                self.node[id].attr({stroke:self.clickColor,strokeWidth:5});
                self.clickedNode = id;
              }else if(self.clickedNode==id){
                self.node[id].attr({stroke:"none"});
                self.clickedNode = null;
              }else{
                self.node[self.clickedNode].attr({stroke:self.clickColor,strokeWidth:5});
                self.connect[self.clickedNode][id]=self.clickedNode+"_to_"+id;
                self.connect[id][self.clickedNode]="reverse";
                if(self.arrow[id+"_to_"+self.clickedNode] ){
                  self.arrow[id+"_to_"+self.clickedNode].remove();
                  self.arrow[id+"_to_"+self.clickedNode] = null;
                }
                if(self.arrow[self.clickedNode+"_to_"+id] == null){
                  self.arrowMakerById(self.clickedNode,id,self.clickedNode+"_to_"+id);
                }
                self.clickedNode = null;
              }
            });
          }else{
            g.select("#text4810").attr({text:title}).dblclick(function(e){
              input = window.prompt("input test", "");
              if(input)this.attr({text:input});
            });
            g.select("#rect4800").click(function(e,x,y){
              if(self.clickedNode==null){
                self.node[id].attr({stroke:self.clickColor,strokeWidth:5});
                self.clickedNode = id;
              }else if(self.clickedNode==id){
                self.node[id].attr({stroke:"none"});
                self.clickedNode = null;
              }else{
                self.node[self.clickedNode].attr({stroke:"none"});
                self.connect[self.clickedNode][id]=self.clickedNode+"_to_"+id;
                self.connect[id][self.clickedNode]="reverse";
                if(self.arrow[id+"_to_"+self.clickedNode] ){
                  self.arrow[id+"_to_"+self.clickedNode].remove();
                  self.arrow[id+"_to_"+self.clickedNode] = null;
                }
                if(self.arrow[self.clickedNode+"_to_"+id] == null){
                  self.arrowMakerById(self.clickedNode,id,self.clickedNode+"_to_"+id);
                }
                self.clickedNode = null;
              }
            });
          }
      g.attr({id:id});
      self.connect[id]={};
      self.signal[id]=false;
      self.node[id]=g;
      callback(g);
      g = null;
      svg = null;
      matrix = null;
      transformString = null;
      });
  };

  //************************//
  //  draw image from file  //
  //************************//
  exports.imageNode = function(file,width,height,x,y,callback) {
    self.position[file] = {x:x,y:y,width:width,height:height};
    var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
    var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0, 0, width, height);
    var img = new Image();    //新規画像オブジェクト
        img.src = file;   //読み込みたい画像のパス
        img.onload = function(){
          ctx.drawImage(img,0,0,width,height);
          var paper = Snap().remove();
          var inputImage = paper.image(canvas.toDataURL(),0,0,canvas.width,canvas.height).attr({id:file});//.drag();
          self.param[file] = {x:0,y:0};
          inputImage.drag(
            function(dx, dy){
              this.attr({x: self.param[file].x+dx,y: self.param[file].y+dy});
              self.position[file].x = self.param[file].x+dx;
              self.position[file].y = self.param[file].y+dy;
              for(key in self.connect[file]){
                self.arrowUpdate(self.connect[file][key], file, key); 
              }
            },function(x,y){
              self.param[file].x= +this.attr("x");
              self.param[file].y= +this.attr("y");
            },function(){
            }
          );
          if(touchsupport){
            inputImage.touchend(function(e){
              if(self.clickedNode==null){
                self.node[file].attr({stroke:self.clickColor,strokeWidth:5});
                self.clickedNode = file;
              }else if(self.clickedNode==file){
                self.node[file].attr({stroke:"none"});
                self.clickedNode = null;
              }else{
                self.node[self.clickedNode].attr({stroke:"none"});
                //self.connect[self.clickedNode][file]=self.clickedNode+"_to_"+file;
                //self.connect[file][self.clickedNode]="reverse";
                //if(self.arrow[file+"_to_"+self.clickedNode] ){
                //  self.arrow[file+"_to_"+self.clickedNode].remove();
                //  self.arrow[file+"_to_"+self.clickedNode] = null;
                //}
                //if(self.arrow[self.clickedNode+"_to_"+file] == null){
                //  self.arrowMakerById(self.clickedNode,file,self.clickedNode+"_to_"+file);
                //}
                alert("Node: Read Only");
                self.clickedNode = null;
              }
            });
          } else {
            inputImage.click(function(e,x,y){
              if(self.clickedNode==null){
                self.node[file].attr({stroke:self.clickColor,strokeWidth:5});
                self.clickedNode = file;
              }else if(self.clickedNode==file){
                self.node[file].attr({stroke:"none"});
                self.clickedNode = null;
              }else{
                self.node[self.clickedNode].attr({stroke:"none"});
                //self.connect[self.clickedNode][file]=self.clickedNode+"_to_"+file;
                //self.connect[file][self.clickedNode]="reverse";
                //if(self.arrow[file+"_to_"+self.clickedNode] ){
                //  self.arrow[file+"_to_"+self.clickedNode].remove();
                //  self.arrow[file+"_to_"+self.clickedNode] = null;
                //}
                //if(self.arrow[self.clickedNode+"_to_"+file] == null){
                //  self.arrowMakerById(self.clickedNode,file,self.clickedNode+"_to_"+file);
                //}
                alert("Node: Read Only");
                self.clickedNode = null;
              }
            });
          }
          self.connect[file]={};
          self.node[file]=paper;
          callback(paper,inputImage,canvas);
          canvas= null;
          ctx= null;
          inputImage= null;
          img= null;
          paper= null;;
        };
  };

  //**************************//
  //  draw video from camera  //
  //**************************//
  exports.camNode = function(width,height,id,callback) {
    var paper = Snap().remove().attr({id:id});
    var fobjectSVG =  '<svg id="video_svg" width="'+width+'" height="'+height+'">'
                     +  '<foreignObject width="100%" height="100%">'
                     +    '<div id="video_div" style="POSITION: absolute; VISIBILITY: visible;">'
                     +      '<canvas id="video_canvas"></canvas>'
                     +    '</div>'
                     +  '</foreignObject>'
                     +'</svg>';
    var p = Snap.parse( fobjectSVG );
    paper.append(p);
    self.param[id] = {x:0,y:0, x2:0,y2:0, userAgent:window.navigator.userAgent.toLowerCase(), origTransform:null};
    self.position[id] = {x:0,y:0,width:width,height:height};
    setTimeout(function(){
      var userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('chrome') != -1) {
        console.log("Chrome!");
        paper.drag(
          function(dx, dy){
            var video_svg = document.getElementById("video_div");
            self.param[id].x2 = self.param[id].x +dx;
            self.param[id].y2=  self.param[id].y +dy;
            video_svg.style.left = self.param[id].x + dx;
            video_svg.style.top = self.param[id].y + dy;
            self.position[id].x = self.param[id].x + dx;
            self.position[id].y = self.param[id].y + dy;
            video_svg = null;
              for(key in self.connect[id]){
                self.arrowUpdate(self.connect[id][key], id, key);
              }
          },function(x,y){
          },function(){
            self.param[id].x = self.param[id].x2;
            self.param[id].y = self.param[id].y2;
          }
        );
      } else {
        paper.drag(
            function(dx, dy){
              this.attr({x: self.param[id].x+dx,y: self.param[id].y+dy});
              self.position[id].x = self.param[id].x+dx;
              self.position[id].y = self.param[id].y+dy;
              for(key in self.connect[id]){
                self.arrowUpdate(self.connect[id][key], id, key); 
              }
            },function(x,y){
              self.param[id].x= +this.attr("x");
              self.param[id].y= +this.attr("y");
            },function(){
            });
      }
      if(touchsupport){
        paper.touchend(function(e){
          if(self.clickedNode==null){
            self.node[id].attr({stroke:self.clickColor,strokeWidth:5});
            self.clickedNode = id;
          }else if(self.clickedNode==id){
            self.node[id].attr({stroke:"none"});
            self.clickedNode = null;
          }else{
            self.node[self.clickedNode].attr({stroke:"none"});
            //self.connect[self.clickedNode][id]=self.clickedNode+"_to_"+id;
            //    self.connect[id][self.clickedNode]="reverse";
            //    if(self.arrow[id+"_to_"+self.clickedNode] ){
            //      self.arrow[id+"_to_"+self.clickedNode].remove();
            //      self.arrow[id+"_to_"+self.clickedNode] = null;
            //    }
            //    if(self.arrow[self.clickedNode+"_to_"+id] == null){
            //      self.arrowMakerById(self.clickedNode,id,self.clickedNode+"_to_"+id);
            //    }
            alert("Node: Read Only");
            self.clickedNode = null;
          }
        });
      } else {
        paper.click(function(e,x,y){
          if(self.clickedNode==null){
            self.node[id].attr({stroke:self.clickColor,strokeWidth:5});
            self.clickedNode = id;
          }else if(self.clickedNode==id){
            self.node[id].attr({stroke:"none"});
            self.clickedNode = null;
          }else{
            self.node[self.clickedNode].attr({stroke:"none"});
            //self.connect[self.clickedNode][id]=self.clickedNode+"_to_"+id;
            //    self.connect[id][self.clickedNode]="reverse";
            //    if(self.arrow[id+"_to_"+self.clickedNode] ){
            //      self.arrow[id+"_to_"+self.clickedNode].remove();
            //      self.arrow[id+"_to_"+self.clickedNode] = null;
            //    }
            //    if(self.arrow[self.clickedNode+"_to_"+id] == null){
            //      self.arrowMakerById(self.clickedNode,id,self.clickedNode+"_to_"+id);
            //    }
            alert("Node: Read Only");
            self.clickedNode = null;
          }
        });
      }
      userAgent = null;
      self.signal[id] = false;
        paper.dblclick(function(e){
        }).touchend(function(e){
          if(self.signal[id]){
            self.signal[id] = false;
          }else{
            setTimeout(function(){self.signal[id]=false;},350);
          }
        });
      self.connect[id]={};
      self.node[id]=paper;
      callback(paper);
      fobjectSVG = null;
      p = null;
      paper = null;
    },5000);
  };


  //***************//
  //  arrow maker  //
  //***************//
  exports.arrowMaker = function(startX, startY, endX, endY, id) {
    var arrow = self.arrowStage.path("M" + startX + "," + startY +"L" + endX + "," + endY).attr({
      fill: "none",
      strokeWidth: 20,
      stroke: "black",
      markerEnd: self.marker
    });//.drag();
    self.arrow[id] = arrow;
    arrow = null;
  };


  //***************//
  //  arrow calc  //
  //***************//
function arrowCalc(startId, endId) {
    var x1 = self.position[startId].x+self.position[startId].width/2;
    var y1 = self.position[startId].y+self.position[startId].height/2;
    var x2 = self.position[endId].x+self.position[endId].width/2;
    var y2 = self.position[endId].y+self.position[endId].height/2;
    var dx = x2-x1;
    var dy = y2-y1;
    var norm = Math.sqrt(dx*dx+dy*dy);
    var ndx = dx/norm;
    var ndy = dy/norm;
    var hw1 = self.position[startId].height/self.position[startId].width;
    var hw2 = self.position[endId].height/self.position[endId].width;
    var offsetRatio1 = self.position[startId].height/(self.position[startId].height+self.position[startId].width);
    var offsetRatio2 = self.position[endId].height/(self.position[endId].height+self.position[endId].width);

    var startX,startY,endX,endY;
    if(dx==0){
      startX = x1;
      endX   = x2;
      if(dy>0){
        startY = y1+ (self.position[startId].height/2+self.offsetStart*ndy);
        endY   = y2- (self.position[startId].height/2-self.offsetEnd*ndy);
      } else {
        startY = y1- (self.position[startId].height/2+self.offsetStart*ndy);
        endY   = y2+ (self.position[startId].height/2-self.offsetEnd*ndy);
      }
    }else if(dx > 0){
      if(dy/dx<=hw1 && dy/dx>=-hw1){
        startX = x1 + (self.position[startId].width/2      )+self.offsetStart*ndx;
        startY = y1 + (self.position[startId].width/2*dy/dx)+self.offsetStart*ndy;
      }else if(dy/dx>hw1){
        startX = x1 + (self.position[startId].height/2*dx/dy)+self.offsetStart*ndx;
        startY = y1 + (self.position[startId].height/2      )+self.offsetStart*ndy;
      }else if(dy/dx<-hw1){
        startX = x1 + (self.position[startId].height/2*(-dx/dy))+self.offsetStart*ndx;
        startY = y1 - (self.position[startId].height/2         )+self.offsetStart*ndy;
      }
      if(dy/dx<=hw2 && dy/dx>=-hw2){
        endX = x2 - (self.position[endId].width/2      )-self.offsetEnd*ndx;
        endY = y2 - (self.position[endId].width/2*dy/dx)-self.offsetEnd*ndy;
      }else if(dy/dx>hw2){
        endX = x2 - (self.position[endId].height/2*dx/dy)-self.offsetEnd*ndx;
        endY = y2 - (self.position[endId].height/2      )-self.offsetEnd*ndy;
      }else if(dy/dx<-hw2){
        endX = x2 - (self.position[endId].height/2*(-dx/dy))-self.offsetEnd*ndx;
        endY = y2 + (self.position[endId].height/2         )-self.offsetEnd*ndy;
      }

    }else if(dx < 0){
      if(dy/dx<=hw1 && dy/dx>=-hw1){
        startX = x1 - (self.position[startId].width/2      )+self.offsetStart*ndx;
        startY = y1 - (self.position[startId].width/2*dy/dx)+self.offsetStart*ndy;
      }else if(dy/dx>hw1){
        startX = x1 - (self.position[startId].height/2*dx/dy)+self.offsetStart*ndx;
        startY = y1 - (self.position[startId].height/2      )+self.offsetStart*ndy;
      }else if(dy/dx<-hw1){
        startX = x1 - (self.position[startId].height/2*(-dx/dy))+self.offsetStart*ndx;
        startY = y1 + (self.position[startId].height/2         )+self.offsetStart*ndy;
      }
      if(dy/dx<=hw2 && dy/dx>=-hw2){
        endX = x2 + (self.position[endId].width/2      )-self.offsetEnd*ndx;
        endY = y2 + (self.position[endId].width/2*dy/dx)-self.offsetEnd*ndy;
      }else if(dy/dx>hw2){
        endX = x2 + (self.position[endId].height/2*dx/dy)-self.offsetEnd*ndx;
        endY = y2 + (self.position[endId].height/2      )-self.offsetEnd*ndy;
      }else if(dy/dx<-hw2){
        endX = x2 + (self.position[endId].height/2*(-dx/dy))-self.offsetEnd*ndx;
        endY = y2 - (self.position[endId].height/2         )-self.offsetEnd*ndy
      }
    }
    x1 = null;
    y1 = null;
    x2 = null;
    y2 = null;
    dx = null;
    dy = null;
    norm = null;
    ndx = null;
    ndy = null;
    hw1 = null;
    hw2 = null;
    offsetRatio1 = null;
    offsetRatio2 = null;
    return {x1: startX, y1: startY, x2: endX, y2: endY}
};

  //***************//
  //  arrow maker by ID  //
  //***************//
  exports.arrowMakerById = function(startId, endId, id) {
    var value = arrowCalc(startId, endId);
    self.arrowMaker(value.x1, value.y1, value.x2, value.y2, id);
    value = null;
    //self.arrowMaker(self.position[startId].x+self.position[startId].width/2,
    //           self.position[startId].y+self.position[startId].height/2,
    //           self.position[endId].x  +self.position[endId].width/2,
    //           self.position[endId].y  +self.position[endId].height/2,
    //           id);
  };

  //****************//
  //  arrow update  //
  //****************//
  exports.arrowUpdate = function(id, startId, endId) {
    if(id=="reverse"){
      var value = arrowCalc(endId, startId);
      self.arrow[endId+"_to_"+startId].attr({path:"M" + value.x1
                                                + "," + value.y1
                                                + "L" + value.x2
                                                + "," + value.y2});
    }else{
      var value = arrowCalc(startId, endId);
      self.arrow[id].attr({path:"M" + value.x1
                                                + "," + value.y1
                                                + "L" + value.x2
                                                + "," + value.y2});
    }
  };

  //**************//
  //  Play Icon   //
  //**************//
  exports.playIcon = function(space,MyVideo) {
    var paper = Snap(80,80).remove().attr({viewBox: [0,0,80,80]});
    var path = paper.path("M10,10L70,10L70,70L10,70z").attr({fill:"#aaa"});
    paper.click(function(){
      if(this.data("switch")){
        MyVideo.restartVideo();
alert("START")
      } else {
        MyVideo.stopVideo();
alert("STOP")
      }
    path.stop().animate(
      this.data("switch")
        ?{path: "M10,10L70,10L70,70L10,70z",fill:"#aaa"}:{path: "M10,10L62,40L10,70z", fill:"red"},1000);
      this.data("switch", !this.data("switch"));
    });
    paper.appendTo(space);
    paper = null;
  };



 return exports;
})();