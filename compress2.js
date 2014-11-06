 ;(function(){
    var canvas = {},
        quaility = 0,
        base64 = '';


    var obj = null;
    function ImgCompress () {
         //单例模式
        if( !obj ){
            obj = this;
            //创建canvas
            canvas = document.createElement('canvas');
            canvas.id = 'canvas'+Math.random();
            canvas.style.backgroundColor = 'black';
            // oCanvas.style.display = 'none';
            canvas.style.backgroundColor = '#000';
            document.body.appendChild(canvas);
        }else{
            return obj;
        }
    }

    ImgCompress.prototype.init = function (oFile, quaility, callback){

        var oCtx = canvas.getContext('2d'),
            url = webkitURL.createObjectURL( oFile.files[0] ),
            oImg = new Image();

        oImg.src = url;
            
        //获取完后进行压缩
        oImg.onload = function() {            
            
            var w = oImg.width,
                h = oImg.height;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            
            oCtx.drawImage(oImg, 0, 0, w, h);

            if( quaility ){
               base64 = canvas.toDataURL('image/jpeg', self.quaility);
            }else{
               base64 = canvas.toDataURL('image/jpeg');
            }
            

            //压缩完后执行回调
            self.callback && self.callback(base64);
        };
    };

    window.ImgCompress = ImgCompress;
 })();
