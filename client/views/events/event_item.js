/**
 * Created with JetBrains WebStorm.
 * User: Fabian
 * Date: 24.07.13
 * Time: 09:03
 * To change this template use File | Settings | File Templates.
 */
Template.eventItem.events(
    {
        'click': function(e) {
            Visibility.showPhoto(e.target.src, e.target.title)
        }
    }
);