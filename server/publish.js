Pictures = new Meteor.Collection("pictures");

Meteor.startup(function () {
    Meteor.publish("pictures", function () {
        return Pictures.find({userId : this.userId});
    });
    Pictures.allow({
        insert: function(userId,doc){
            if (userId === Meteor.userId())
            return true;
            return false;
        }
    })
});

