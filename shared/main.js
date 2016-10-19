Meteor.methods({
addComment:function(comment){
  console.log("addComment method running");
  if(this.userId){//we have a user    
    //comment.owner = this.userId;
    return Comments.insert(comment);
  }
  return ;
},  
addDoc:function(){
  var doc;
  if(!this.userId) {
    return;//give up
  }
  else {
    doc = {owner:this.userId, createdOn:new Date(), title:"my new doc1", isPrivate: false};    
    var id = Documents.insert(doc);   
    console.log("addDoc method: got an id"+id);
    return id;

  }
},
updateDocPrivacy:function(doc){
  console.log("updateDocPrivacy method called");
  console.log(doc);
  var realDoc = Documents.findOne({_id:doc._id, owner:this.userId});
  if(realDoc) {
    realDoc.isPrivate = doc.isPrivate;
    Documents.update({_id:doc._id}, realDoc);
  }
  else {

return;
  }
},
addEditingUser:function(docid){
  var doc, user, eusers;
  doc = Documents.findOne({_id:docid});
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