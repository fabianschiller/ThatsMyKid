if (Meteor.is_client) {
    Meteor.startup(function () {
        $(document).ready(function (){
            Visibility.bindClickHandlers()
        });
    });
}

Visibility = {}

Visibility.bindClickHandlers = function() {
    "use strict";
    $('#photo_viewer').on('click', function() {
        Visibility.hidePhoto()
    })
}

Visibility.showPhoto = function(url, comment) {
    "use strict";
    $('#photo_box_img').attr("src", url);
    $('#photo_comment').text(comment);
    $('#photo_viewer').css("visibility", "visible");
}

Visibility.hidePhoto = function() {
    "use strict";
    $('#photo_viewer').css("visibility", "hidden")
}

//Visibility.hideEMail = function() {
//    "use strict";
//    $('#missingfeature_viewer').css("visibility", "hidden")
//}
//}