/**
 * Created with JetBrains WebStorm.
 * User: fabianschiller
 * Date: 11.08.13
 * Time: 14:40
 * To change this template use File | Settings | File Templates.
 */

Template.shares.events(
    {
        'click #shares-button': function(e) {
            var elem = document.getElementById("shares-dialog");
            if (elem.style.visibility === "visible")
                elem.style.visibility = "hidden";
            else
                elem.style.visibility = "visible";
        }
    }
);