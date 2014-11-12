 /**
  * 图片压缩
  * 调用方式:  var oImgProgress = new ImgCompress();
  *            oImgProgress.init({ file: oFile, maxWidth: 1024, maxSize: 300, quality: 0.8, function (response){ if(response.success){ console.log(response.data); }  } });
  * 当图片大于maxWidth时，裁切并压缩；
  * 当图片大于maxSize时，压缩；
  * @return {[string]} [base64图片格式字符串]
  */
 
 /**
  * 没有裁切的情况下,不写压缩系数有可能比原来的大,此时直接用0.8
  * 裁切的情况下,浏览器自己定的参数很好，此时不用写压缩系数
  */
;( function (){

    'use strict';

    var obj = null;

    function ImgCompress () {
         //单例模式
        if( !obj ){
            obj = this;
            //创建canvas
            var oCanvas = document.createElement('canvas');
            oCanvas.id = 'canvas'+Math.random();
            //oCanvas.style.backgroundColor = 'black';
            //oCanvas.style.display = 'none';
            document.body.appendChild(oCanvas);
            this.canvas = oCanvas;
        }else{
            return obj;
        }   

        //一些属性
        this.defaults = {
            file: null,
            quaility: 0.8,
            maxWidth: 1024,
            maxSize: 300,
            callback: function (){}
        };

    }

    ImgCompress.prototype = {

        init: function (opts){
            var self = this;

            //初始化参数
            self._extend( self.defaults, opts );

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
            var url = webkitURL.createObjectURL( self.defaults.file.files[0] ),
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
                imgW = oImg.width,
                imgH = oImg.height,
                imgSize = this.defaults.file.files[0].size,
                maxW = this.defaults.maxWidth,
                maxSize = this.defaults.maxSize * 1024,
                base64 = '',
                bSuccess = true,
                oCtx = this.canvas.getContext('2d');

            

            //处理宽度
            if( imgW > maxW ){
                var scale = imgW / imgH;
                var h = maxW / scale;

                self.canvas.width = maxW;
                self.canvas.height = h;
                oCtx.drawImage(oImg, 0, 0, maxW, h);
                base64 = self.canvas.toDataURL('image/png');
            }else{
                //处理质量大小
                /*if( imgSize > maxSize ){                    
                    self.canvas.width = imgW;
                    self.canvas.height = imgH; 
                    oCtx.drawImage(oImg, 0, 0, imgW, imgH); 
                    base64 = self.canvas.toDataURL('image/png', self.defaults.quaility);
                }else{
                    bSuccess = false;   //不用压缩
                    base64 = '';
                }*/
                self.canvas.width = imgW;
                self.canvas.height = imgH; 
                oCtx.drawImage(oImg, 0, 0, imgW, imgH); 
                base64 = self.canvas.toDataURL('image/png', self.defaults.quaility);
            }   
            //drawImage(imageObj,sourceX,sourceY,sourceWidth,sourcHeight,destX,destY,destWidth,destHeight)
            //截图( 图像， [原图的剪切起点X， 原图的剪切起点Y，剪切的宽度， 剪切的高度， 图片在canvas上的X， 图片在canvas上的Y]， 最终画在canvas上图片的宽度，最终画在canvas上图片的高度   )
            //oCtx.drawImage(oImg, 600, 1090, 1920, 1080, 0, 0, 400, 400);
            //压缩完后执行回调
            var response = { success: bSuccess, data: base64 };
            self.defaults.callback && self.defaults.callback( response );
        },

        _extend: function (defaults, opts){
            for( var attr in opts ){
               defaults[attr] = opts[attr];
            }
        }

    };

    window.ImgCompress = ImgCompress;

 })();
    