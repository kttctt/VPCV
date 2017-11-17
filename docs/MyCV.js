/*
 * MyCV module
 * âÊëúèàóù
 * 2014/03/28
 * Tabata S
 *
 */

(function(){
    var MyCV;
    var _root = this;

    if(typeof exports !== 'undefined'){
        MyCV = exports;      // for CommonJS (ÇÊÇ≠ÇÌÇ©ÇÁÇ»Ç¢)
    }else{
        MyCV = _root.MyCV = {};
    }
    var version = {
        release: '0.0.1',
        date:    '2014-03-28'
    };
    
    MyCV.versionEcho = function(){
        return "version " + version.release + ", released " + version.date;
    };

    /*****************************************************/
    /*                        core                       */
    /*****************************************************/

    var core = {
        grayscale: function(image){
            var data = image.data;
            var num = data.length;
            var pix = num << 2;
            var r, g, b, gray, i4;

            for(var i = 0; i < pix; i++){
                i4 = i*4
                r = data[ i4 ];
                g = data[ i4 + 1];
                b = data[ i4 + 2];

                gray = parseInt(( r*30+g*59+b*11)*0.01);

                data[i4]   = gray;
                data[i4+1] = gray;
                data[i4+2] = gray;
            }
            image.data = data;
            return image;
        }
    }
    MyCV.grayscale = core.grayscale;
}).call(this);
