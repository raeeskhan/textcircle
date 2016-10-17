import { Meteor } from 'meteor/meteor';


Meteor.startup(() => {
  // code to run on server at startup
  if(!Documents.findOne()) {

    var id = Documents.insert({"title":"my new document"});
  //  Session.set("docid",id);
  }
});

Meteor.publish("documents", function(){
	return Documents.find({
		$or:[
		{isPrivate: false},
		{owner:this.userId}
		]
	});
})

Meteor.publish("editingUsers", function(){
	return EditingUsers.find({});
})