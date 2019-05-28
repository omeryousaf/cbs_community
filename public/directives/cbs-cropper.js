import angular from 'angular';

angular.module('customDirectives', [])
	.directive('cbsCropper', function(ConfigService, Upload) {

	    var prepareImageTransformDataForBackend = function ( photo, scalingFactor ) {
	        // save the width and height to scale the image to (needed by imagemagick at backend), and also save x,y of top left corner of scaled image which
	        // will act as offsets to be subtracted from top_left corner of to-be-cropped area in order to take imagemagick to correct starting point for cropping
	        var imageInfoForImageMagic = {
	            offset: {}
	        };
	        var updateCanvas = $( photo ).data('cropper').getCanvasData();
	        var implicitScalingFactor = updateCanvas.height / updateCanvas.naturalHeight;
	        var reductionInWidthByScaling = ( 1 - scalingFactor ) * updateCanvas.width;
	        imageInfoForImageMagic.offset.x = reductionInWidthByScaling / ( 2 * implicitScalingFactor );
	        if ( updateCanvas.top < 0 ) {
	            imageInfoForImageMagic.offset.y = Math.abs( updateCanvas.top ) / implicitScalingFactor;
	        } else {
	            imageInfoForImageMagic.offset.y = 0;
	        }
	        imageInfoForImageMagic.scaleToWidth = scalingFactor * updateCanvas.width / implicitScalingFactor;
	        imageInfoForImageMagic.scaleToHeight = scalingFactor * updateCanvas.height / implicitScalingFactor;
	        return imageInfoForImageMagic;
	    };

	    var scaleImage = function ( photo, scalingFactor, updatedCropBox ) {
	        if ( scalingFactor < 1 ) { // when canvas height is greater than the photo container height, scale (on both x and y
	            // axes to maintain aspect ratio and) to make canvas height fit container height
	            $( photo ).data('cropper').scale( scalingFactor, scalingFactor );
	        } else { // when canvas height is NOT greater than container height but image is already scaled, revert the scaling cuz the current rotation will bring
	            // the image back to its original orientation (landscape/portrait)
	            scalingFactor = 1 / $( photo ).data('cropper').getData().scaleX;
	            $( photo ).data('cropper').scale( 1, 1 );
	        }
	        var updateCanvas = $( photo ).data('cropper').getCanvasData();
	        updateCanvas.mid = {
	            x: ( 2 * updateCanvas.left + updateCanvas.width ) / 2,
	            y: ( 2 * updateCanvas.top + updateCanvas.height ) / 2
	        };
	        var translationCoeffForScalingX = scalingFactor * (-1 * updateCanvas.mid.x ) + updateCanvas.mid.x;
	        var translationCoeffForScalingY = scalingFactor * (-1 * updateCanvas.mid.y ) + updateCanvas.mid.y;
	        updatedCropBox.left = scalingFactor * updatedCropBox.left + translationCoeffForScalingX;
	        updatedCropBox.top = scalingFactor * updatedCropBox.top + translationCoeffForScalingY;
	        updatedCropBox.width *= scalingFactor;
	        updatedCropBox.height *= scalingFactor;
	        $( photo ).data('cropper').setCropBoxData( updatedCropBox );
	    };

	    var rotateImage = function ( photo, angle ){
	        var cropBoxArea = $( photo ).data('cropper').getCropBoxData();
	        var angleInRadians = angle * (Math.PI / 180);
	        var cosOfAngle =  Math.cos( angleInRadians );
	        var sinOfAngle = Math.sin( angleInRadians );
	        var canvasData = $( photo ).data('cropper').getCanvasData();
	        var canvasCenter = {
	            x: canvasData.left + canvasData.width / 2,
	            y: canvasData.top + canvasData.height / 2
	        };
	        var translationCoeffX = cosOfAngle * (-1 * canvasCenter.x) - sinOfAngle * (-1 * canvasCenter.y) + canvasCenter.x;
	        var translationCoeffY = sinOfAngle * (-1 * canvasCenter.x) + cosOfAngle * (-1 * canvasCenter.y) + canvasCenter.y;
	        var cropboxTopLeftX = cosOfAngle * cropBoxArea.left - sinOfAngle * cropBoxArea.top + translationCoeffX;
	        var cropboxTopLeftY = sinOfAngle * cropBoxArea.left + cosOfAngle * cropBoxArea.top + translationCoeffY;
	        if ( angle > 0 ) {
	            cropboxTopLeftX -= cropBoxArea.height;
	        }
	        if ( angle < 0 ) {
	            cropboxTopLeftY -= cropBoxArea.width;
	        }
	        var updatedCropBox = {
	            left: cropboxTopLeftX,
	            top: cropboxTopLeftY,
	            width: cropBoxArea.height,
	            height: cropBoxArea.width
	        };
	        $( photo ).data('cropper').rotate( angle );
	        $( photo ).data('cropper').setCropBoxData( updatedCropBox );
	        // handle scaling now if scaling is needed to fit image in container after rotation
	        var containerHeightFactor = $(".js_image_upload").height() / $( photo ).data('cropper').getCanvasData().height;
	        scaleImage( photo, containerHeightFactor, updatedCropBox );
	    };

	    var initCropper = function(photo) {
	    	if (photo.length != 0) {
                $(photo).cropper({
                    aspectRatio: 1,
                    rotatable: true,
                    zoomable: false,
                    background: false,
                    guides: false,
                    autoCropArea: 1,
                    checkOrientation: false,
                    checkCrossOrigin: false,
                    movable: false,
                    toggleDragModeOnDblclick: false,
                    crop: function(e) {},
                    built: function() {}
                });
            }
	    }

	    return {
	        link: function(scope, element, attrs) {
	            scope.$watch('isPhotoLoaded', function (value) {
	            	if (value) {
	            		attrs.$set('src', scope.$parent.uploadPath);
	                	initCropper(element[0]);
	            	}
	            });

	            scope.rotateImage = function ( direction ) {
	                if ( direction == 'L' ) {
	                    rotateImage( element[0], -90 );
	                }
	                if ( direction == 'R' ) {
	                    rotateImage( element[0], 90 );
	                }
	            };

	            scope.confirmCrop = function () {
	                var imageTransformData = $( element[0] ).data('cropper').getData();
	                var infoForImageMagic = prepareImageTransformDataForBackend( element[0], imageTransformData.scaleX );
	                imageTransformData.x = imageTransformData.x - infoForImageMagic.offset.x;
	                imageTransformData.y = imageTransformData.y - infoForImageMagic.offset.y;
	                imageTransformData.scaleToWidth = infoForImageMagic.scaleToWidth;
	                imageTransformData.scaleToHeight = infoForImageMagic.scaleToHeight;
	                scope.$emit('imgTransformDataReady', imageTransformData);
	            };
	        }
	    };
});