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
            var self = this;
            var url = webkitURL.createObjectURL( self.file.files[0] ),
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

            self.canvas.width = 800;
            self.canvas.height = 800;
            
            //drawImage(imageObj,sourceX,sourceY,sourceWidth,sourcHeight,destX,destY,destWidth,destHeight)
            //截图( 图像， 原图的剪切起点X， 原图的剪切起点Y，剪切的宽度， 剪切的高度， 剪切结束点X， 剪切结束点Y，   )
            oCtx.drawImage(oImg, 600, 1090, 1920, 1080, 0, 0, 400, 400);
            if( self.quaility ){
                base64 = self.canvas.toDataURL('image/jpeg', self.quaility);
            }else{
                base64 = self.canvas.toDataURL('image/jpeg');
            }
            

            //压缩完后执行回调
            self.callback && self.callback(base64);
        }

    };

    window.ImgCompress = ImgCompress;
 })();
    