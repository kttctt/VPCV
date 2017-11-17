/*
 * Video class
 * 動画処理
 * 2014/04/01
 * 2015/07/14 最終更新
 * Tabata S
 *
 */

// requestAnimationFrameの設定
 (function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

// コンストラクタ

function Video_CLASS( _name, _videoId, _width, _height, _camera, _audio){
    this.name = _name;
    this.video = document.getElementById(_videoId);
    this.localMediaStream = null;
    this.localMediaStreamTrack = null;
    this.width = _width;
    this.height = _height;
    this.camera = _camera;
    this.audio = _audio;
    this.animationMode = true;
//    this.animationCanvas = null;
//    this.animationFunc = function(_canvas){};
    this.init(_camera, _audio);
}

   // インスタンスメソッド
    Video_CLASS.prototype = {

        debug: function(){
            console.log(this);
        },

        init: function(_camera, _audio){
            window.URL = window.URL || window.webkitURL;
            navigator.getMedia = (navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia);

            if(navigator.getMedia){
                console.log("camera OK!");
            }else{
                alert("未対応ブラウザです.");
            }

            var tmp_this = this;

            navigator.getMedia({video: _camera, audio: _audio},
                    function(stream){
                        console.log("Camera : " + tmp_this);
                        //tmp_this.video.width = tmp_this.width;
                        //tmp_this.video.height = tmp_this.height;
                        tmp_this.video.src = window.URL.createObjectURL(stream);
                        //tmp_this.localMediaStream = stream;
                        tmp_this.localMediaStream = stream;
                        tmp_this.localMediaStreamTrack = stream.getTracks()[0];
                        tmp_this.video.autoplay = true;
                    },
                    function(e){
                        alert("カメラが開けません");
                        console.log('error! ' + e);
                    }
            );
        },

        stopVideo: function(){
            if(this.localMediaStream.active){
                this.localMediaStreamTrack.stop();
            }
        },

        restartVideo: function(){
            if(!this.localMediaStream.active){
                this.init(this.camera, this.audio);
            }
        },

        getVideo: function(){
                return video;
        },

        getVideoSize: function(){
                //alert(video.videoWidth + ","+video.videoHeight );
                return {width:video.videoWidth, height:video.videoHeight};
        },

        setEvent: function(_func){
            var tmp_this = this;
            this.video.addEventListener('click',
                    function(){
                        console.log(tmp_this.name + ": video clicked!");
                        _func();
                    }
            );
        },

        drawVideo: function(_canvas){
            var _ctx = _canvas.getContext('2d');
            _canvas.width = this.width;
            _canvas.height = this.height;
            _ctx.drawImage(this.video, 0, 0, this.width, this.height);
        },

        audio_init: function(){
            if(this.localMediaStream && this.audio){
                var contextA = this.ctxA = new (window.AudioContext || window.webkitAudioContext);
                this.microphone = contextA.createMediaStreamSource(this.localMediaStream);
                this.audioAnalyser = contextA.createAnalyser();
                this.audioAnalyzedData = new Uint8Array(this.audioAnalyser.freqencyBinCount);
                this.microphone.connect(this.audioAnalyser);
                contextA.decodeAudioData(this.sourceA,function(){
                    this.audioAnalyzedData = buffer;
                });
            }
        },

        audio_read: function(){
            if(this.audioAnalyzedData){
                
            }
        },

        getAudioData: function(){
            return this.audioAnalyzedData;
        },

        animationData_timeupdate:function(_func){
            var tmp_this = this;
            this.video.addEventListener('timeupdate',
                    function(){
                        console.log(tmp_this.name + ": video clicked!");
                        _func();
                    }
            );
        },

        drawAnimation_timeupdate: function(_canvas){
            var tmp_this = this;
            this.video.addEventListener('timeupdate',
                    function(){
                        var _ctx = _canvas.getContext('2d');
                        _canvas.width = tmp_this.width;
                        _canvas.height = tmp_this.height;
                        _ctx.drawImage(tmp_this.video, 0, 0, tmp_this.width, tmp_this.height);
                    }
            );
        },

        drawAnimationWithFunc_timeupdate: function(_canvas, _func){
            var tmp_this = this;
            this.video.addEventListener('timeupdate',
                    function(){
                        var _ctx = _canvas.getContext('2d');
                        _canvas.width = tmp_this.width;
                        _canvas.height = tmp_this.height;
                        _ctx.drawImage(tmp_this.video, 0, 0, tmp_this.width, tmp_this.height);
                        _func(_canvas);
                    }
            );
        },

//        animeSetFunc: function (_canvas, _func){
//            this.animationCanvas = _canvas;
//            this.animationFunc = _func;
//        },

        anime:  function(_canvas){
            if(this.animationMode){
                var _ctx = _canvas.getContext('2d');
                if(this.video.videoHeight == 0){
                    _canvas.width = this.width;
                    _canvas.height = this.height;
                }else{
                    //_canvas.width = this.video.videoWidth;
                    //_canvas.height = this.video.videoHeight;
                    _canvas.width = this.width;
                    _canvas.height = this.width*this.video.videoHeight/this.video.videoWidth;
                }
                _ctx.drawImage(this.video, 0, 0, _canvas.width, _canvas.height);
//                 this.animationFunc(this.animationCanvas);
                _ctx = null;
             }
        }
//,
//        animeLoop: function (){
//            this.anime();
//            requestAnimationFrame(this.animeloop);
//        }

    }

