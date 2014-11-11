  var obj = null;

    function ImgCompress(){

        //单例模式
        if( !obj ){
            obj = this;
            //创建canvas
            var oCanvas = document.createElement('canvas');
            oCanvas.id = 'canvas'+Math.random();
            oCanvas.style.backgroundColor = 'black';
            oCanvas.style.display = 'none';
            document.body.appendChild(oCanvas);
            this.canva = oCanvas;
        }else{
            return obj;
        }   

        this.response = {
           fail: {type: -1, msg: "不符合压缩比例", data: false},
           same: {type: 0, msg: "不用压缩", data: false},
           done: {type: 1, msg: "压缩成功", data: null}
        };
        
        //上传图片数据
        this.uploadData = {
            width: 0,
            height: 0,
            scale: 1
        };

        //压缩图片数据
        this.compressData = {
            width: 0,
            height: 0,
            scale: 1,
            minWidth: 320,
            maxWidth: 1024,
            maxSize: 300
        };

    }

    ImgCompress.prototype = {

        init: function (opts, fn){
            var self = this;

            self.fn = fn;
            
            self.file = opts.file;
            self._compressImg = '';

            self.compressData.width = opts.width;
            self.compressData.height = opts.height;
            self.compressData.maxWidth = opts.maxWidth;
            self.compressData.scale = opts.width / opts.height;
            self.compressData.maxSize = opts.maxSize * 1024;

            self._setUp();
        },

        _setUp: function ( fn ){
            var self = this;

            //获取上传图片
            var url = webkitURL.createObjectURL( self.file );
            var oImg = new Image();
            oImg.src = url;

            oImg.onload = function() {
                
                //上传图片数据
                self.uploadData.width = oImg.width;
                self.uploadData.height = oImg.height;
                self.uploadData.scale = self.uploadData.width / self.uploadData.height;

                // //不符合比例
                // if( self.compressData.scale !== self.uploadData.scale ){
                //     self.fn && self.fn(self.response.fail);
                // }else{
                //     //如果图片太大,就压缩
                //     if( self.file.size > self.compressData.maxSize ){
                //         var data = self._setupCompress.call(self, oImg);

                //         self.response.done.data = data;
                //         self.fn && self.fn(self.response.done);
                //     }else{                    
                //         self.fn && self.fn(self.response.same);
                //     }
                // }
                // 
                // 
                

                if( self.uploadData.width < self.compressData.minWidth  ){
                    self.fn && self.fn(self.response.fail);
                }else{
                
                    if( self.file.size > self.compressData.maxSize ){
                        var data = self._setupCompress.call(self, oImg);

                        self.response.done.data = data;
                        self.fn && self.fn(self.response.done);
                    }else{                    
                        self.fn && self.fn(self.response.same);
                    }
                }
            };
        },

        //压缩图片
        _setupCompress: function (oImg){
            var self = this;
            var oContext = self.canva.getContext('2d');

            //压缩的尺寸
            var compressW = self.uploadData.width,    
                compressH = self.uploadData.height;
            var bResetDimention = self.uploadData.width > self.compressData.maxWidth ? true : false;  //如果大于指定尺寸,就要裁成指定尺寸                    
            if(  bResetDimention  ){  //如果大于最大尺寸，裁成至最大尺寸                      
                compressW = self.compressData.maxWidth;
                compressH = self.compressData.maxWidth / self.compressData.scale;
            }

            //把图画到canvas上
            $( self.canva ).attr( {width : compressW, height : compressH} );
            oContext.drawImage(oImg, 0, 0, compressW, compressH);
            //拿canvas上的图像数据
            if( bResetDimention ){    //如果大于最大尺寸  
                self._compressImg = self.canva.toDataURL('image/jpeg');
            }else{
                //  >300K就进行压缩
                //  大于指定尺寸，让浏览器自行定义压缩比例
                //  小于时，但>1M时
                self._compressImg = self.canva.toDataURL('image/jpeg', 0.8);
            }

            return self._compressImg;
        },    

        getData: function (){       
            return this._compressImg;
        },

        constructor: ImgCompress

    };