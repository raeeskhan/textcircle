import { Template } from 'meteor/templating';
//import { Session } from 'meteor/session';
import './main.html';

//Session.set('current_date', 8);
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"

});
Template.editor.helpers({
  docid:function(){
    var doc = Documents.findOne()._id;
    if(doc) {
      return doc;
    }
    else {
      return undefined;
    }
  },
  config:function(){
    return function(editor){
      editor.setOption("lineNumbers", true);
      editor.setOption("theme", "cobalt");
      editor.on("change", function(cm_editor, info){
        console.log(cm_editor.getValue());
        $("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
        Meteor.call("addEditingUser");
      })

    }
  }
});

Template.editingUsers.helpers({
  users:function(){
    var doc, eusers, users;
    doc = Documents.findOne();
    if(!doc) {return;}//documents not exists
    eusers = EditingUsers.findOne({docid:doc._id});
    if(!eusers) {return;}//no entry in editingUsers
    users = new Array();
    var i =0;
    for (var user_id in eusers.users) {
      console.log("adding a user");
      console.log(eusers.users[user_id]);
      users[i] = eusers.users[user_id];
      //users[i] = fixObjectKeys(eusers.users[user_id]);
      i++;
    }

    return users;

  }

});

// this renames object keys by removing hyphens to make the compatible
// with spacebars.
function fixObjectKeys(obj){
  var newObj = {};
  for (key in obj){
    var key2 = key.replace("-", "");
    newObj[key2] = obj[key];
  }
  return newObj;
}
