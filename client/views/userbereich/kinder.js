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

Template.userBereich.events(
    {
        'drop' : function(e) {
            e.stopPropagation();
            e.preventDefault();

            var files = e.dataTransfer.files; // FileList object.
            var reader = new FileReader();
            // files is a FileList of File objects. List some properties.
          /*  var output = [];
            for (var i = 0, f; f = files[i]; i++) {
                output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                    f.size, ' bytes, last modified: ',
                    f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                    '</li>');
            }

            document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';*/

            reader.onload = function(event) {
                var img = $('#preview');
                img.attr('src', event.target.result);

/*             var maxImageWidth = 100;
                var maxImageHeight = 100;

                var canvas = document.createElement('canvas');
                canvas.width = maxImageWidth;
                canvas.height = maxImageHeight;

                var ctx = canvas.getContext("2d");
                alert("Test4");

                ctx.drawImage(img, 0, 0, maxImageWidth, maxImageHeight);

                alert("Test5");
                var finalFile = canvas.toDataURL(files[0].type);*/

                Pictures.insert({
                    userId: Meteor.userId(),
                    name : files[0].name,
                    data : event.target.result
                });
            }

            reader.readAsDataURL(files[0]);
        },
        'dragover' : function (e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }
    }
);