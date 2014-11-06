 ;(function(){
    var obj = null;

    function ImgCompress () {
         //单例模式
        if( !obj ){
            obj = this;
            //创建canvas
            var oCanvas = document.createElement('canvas');
            oCanvas.id = 'canvas'+Math.random();
            oCanvas.style.backgroundColor = 'black';
            // oCanvas.style.display = 'none';
            oCanvas.style.backgroundColor = '#000';
            document.body.appendChild(oCanvas);
            this.canvas = oCanvas;
        }else{
            return obj;
        }   

        //一些属性
        this.file = null;
        this.quaility = 1;
        this.callback = function (){};
    }

    ImgCompress.prototype = {

        init: function (oFile, quaility, callback){
            var self = this;
            self.file = oFile;
            self.quaility = quaility;
            self.callback = callback;

            //开始压缩图片
            self._compressImg();
        },

        //压缩图片
        _compressImg: function (){
            this._getImgFromFile();
        },

        //获取file中的上传图片
        _getImgFromFile: function(){  
            var self = this,
                url = webkitURL.createObjectURL( self.file.files[0] ),
                oImg = new Image();

            oImg.src = url;

            //获取完后进行压缩
            oImg.onload = function() {            
                self._transferToBase64(oImg);
            };

        },

        //获取压缩后的图片
        _transferToBase64: function (oImg){
            var self = this,
                w = oImg.width,
                h = oImg.height,
                base64 = '',
                oCtx = this.canvas.getContext('2d');

            self.canvas.style.width = w + 'px';
            self.canvas.style.height = h + 'px';
            
            oCtx.drawImage(oImg, 0, 0, w, h);
            if( self.quaility ){
               // base64 = self.canvas.toDataURL('image/jpeg', self.quaility);
            }else{
               // base64 = self.canvas.toDataURL('image/jpeg');
            }
            

            //压缩完后执行回调
           // self.callback && self.callback(base64);
        }

    };

    window.ImgCompress = ImgCompress;
 })();
    