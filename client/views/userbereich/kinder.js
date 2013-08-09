/**
 * Created with JetBrains WebStorm.
 * User: Fabian
 * Date: 25.07.13
 * Time: 15:25
 * To change this template use File | Settings | File Templates.
 */

Pictures = new Meteor.Collection("pictures");
Meteor.subscribe("pictures");


Template.userBereich.pics = function() {
    return Pictures.find({userId : Meteor.userId()}, {sort: {$natural:-1}});
}

var doLog = true;
// "global" "constants"

var c_maxScaledImageWidth = 200;
var c_maxScaledImageHeight = 200;
var c_hiddenFullImageID = "hiddenFullImage";

// we need the canvas for scaling the preview pics
var canvas = null;

function log(msg){
    if (doLog)
        console.log(msg);

}


// just for debugging purposes
function deleteImage(image) {
    var jq = $(image);
    if (jq.attr("class") != "event-thumb") {
        alert("no img");
        return;
    }

    var id = jq.attr("id").substring(4);

    Pictures.remove(id);
}


// creates a "singleton" hidden image without size restrictions which serves as buffer for the scaling operation 
function hiddenFullImage() {
    var selector = "#" + c_hiddenFullImageID;
    var res = $(selector);

    if (res.attr("id") == c_hiddenFullImageID)
        return res;


    // the following should only be executed once per client run
    res = $("<img></img>");
    res.attr("id", c_hiddenFullImageID);
    res.css("visibility", "hidden");
    $("body").append(res);

    // important: callback is executed once the image is loaded into the buffer
    res.on("load", function() {

        finishScalingImage();
    });




    return res;
}



function startScalingImage(imageData, imageName, fileType) {
    var hiddenImage = hiddenFullImage();
    hiddenImage.data("imageName", imageName);
    hiddenImage.data("fileType", fileType);
    hiddenImage.attr("src", imageData);

    // loading the img can take quite a while, so most likely the image will not be available already  
    // when we retrieve its original width and height during a "normal" execution sequence; hence we have to work with a callback:     
    // once the image is fully loaded, finishScalingImage will be called (see hiddenFullImage's onLoad)


}




function finishScalingImage() {

    var hiddenImage = hiddenFullImage();

    // get the DOM image element

    var img = hiddenImage.get(0); // the first child of the jquery object is the actual DOM element


    if (canvas == null) {
        canvas = document.createElement("canvas");
    }

    log("W: " + img.width + " H:" + img.height);

    // scale and preserve aspect ratio using the predefined max values 
    var scaledWidth = img.width;
    var scaledHeight = img.height;

    if (scaledWidth > scaledHeight) {
        if (scaledWidth > c_maxScaledImageWidth) {
            scaledHeight *= c_maxScaledImageWidth / scaledWidth;
            scaledWidth = c_maxScaledImageWidth;
        }
    } else {
        if (scaledHeight > c_maxScaledImageWidth) {
            scaledWidth *= c_maxScaledImageHeight / scaledHeight;
            scaledHeight = c_maxScaledImageHeight;
        }
    }
    log("SW: " + scaledWidth + " SH:" + scaledHeight);
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    Pictures.insert({
        userId: Meteor.userId(),
        name : hiddenImage.data("imageName"),
        data : canvas.toDataURL(hiddenImage.data("fileType"))
    });



}

function scaleAndStoreImage(imageData, imageName, fileType) {
    startScalingImage(imageData, imageName, fileType);
}



Template.userBereich.events (
    {
        'dblclick': function(e) {
            deleteImage(e.target);


        },

        'drop' : function(e) {
            var files = e.dataTransfer.files; // FileList object.
            e.stopPropagation();
            e.preventDefault();

            if (files.length == 0) {
                // alert("No external file dropped");
                return;

            }


            var files = e.dataTransfer.files; // FileList object.
            var reader = new FileReader();
            reader.onload = function(event) {


                if (!files[0].type.match(/image.*/)) {
                    alert("This is not an image!");
                    return;
                };


                scaleAndStoreImage(event.target.result, files[0].name, files[0].type);


                /*
                 Pictures.insert({
                 userId: Meteor.userId(),
                 name : files[0].name,
                 data : event.target.result
                 });
                 */


            }


            reader.readAsDataURL(files[0]);
        },
        'dragover' : function (e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }
    }
)