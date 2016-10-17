import { Template } from 'meteor/templating';
//import { Session } from 'meteor/session';
import './main.html';
Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");
//Session.set('current_date', 8);
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"

});
Template.editor.helpers({
  docid:function(){
    setupCurrentDocument();
    return Session.get("docid");
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
      //console.log("adding a user");
      //console.log(eusers.users[user_id]);
      users[i] = eusers.users[user_id];
      //users[i] = fixObjectKeys(eusers.users[user_id]);
      i++;
    }

    return users;

  }

});

Template.navbar.helpers({
  documents:function(){
    return Documents.find();
  }
})
Template.docMeta.helpers({
  documents:function(){
    return Documents.findOne({_id:Session.get("docid")});
  },
  canEdit:function(){
    var doc = Documents.findOne({_id:Session.get("docid")});
    if(doc.owner==Meteor.userId()) {
        return true;
    }
    else {
      return false;
    }
  }
})

Template.editableText.helpers({
  userCanEdit : function(doc, Collection) {
    //can edit if owner
    doc = Documents.findOne({_id:Session.get("docid"), owner:Meteor.userId()});
    if(doc) {
      return true;
    }
    else {
      return false;
    }

  }

})
//Events
Template.navbar.events({
  'click .js-add-doc':function(event){
    event.preventDefault();
    console.log("Add a new doc!");
    if(!Meteor.user()) {//if user not available
      alert("Please login to create a new document");
    }
    else {//they are logged in insert doc
      var id = Meteor.call("addDoc", function(err, res){
        if(!err) {//all good
          console.log("event callback received: "+res);
          $('.js-tog-private').attr('checked', false);
          Session.set("docid", res);
        }
      });
    }
  },
  'click .js-go-doc':function(event){
    Session.set("docid", this._id)
  }

})

Template.docMeta.events({
  'click .js-tog-private':function(event) {
    console.log(event.target.checked);
    var doc = {_id:Session.get("docid"), isPrivate:event.target.checked}
    Meteor.call("updateDocPrivacy", doc);
  }

})

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
function setupCurrentDocument() {
  var doc;
  if(!Session.get("docid")) {//no doc id set
      doc = Documents.findOne();
      if(doc) {
      Session.set("docid", doc._id);
    }
  }
}
