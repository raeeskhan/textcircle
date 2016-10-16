this.Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");

Meteor.methods({
addEditingUser:function(){
  var doc, user, eusers;
  doc = Documents.findOne();
  if(!doc) {return;} //doc not in db
  //console.log("doc exists"+doc);
  if(!this.userId) {return;} //no one logged in
  //if here then someone logged in editing
//  console.log("user logged in"+this.userId);
  user = Meteor.user();
  //console.log(user);
  eusers = EditingUsers.findOne({docid:doc._id});
  if(!eusers) {
    eusers = {
    docid:doc._id,
    users:{},
  };
  }
  user.lastEdit = new Date();
  //console.log("user"+user+ "ready to be entered into"+doc);
  eusers.users[this.userId] = user;
  EditingUsers.upsert({_id:eusers._id}, eusers);
}

})
