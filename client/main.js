import { Template } from 'meteor/templating';
//import { Session } from 'meteor/session';
import './main.html';

//Session.set('current_date', 8);

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
      editor.on("change", function(cm_editor, info){
        console.log(cm_editor.getValue());
        $("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
      })

    }
  }
});

Template.editor.events({

});
