var mongoose = require('mongoose');

exports.id = 'indexer';
exports.version = 'v1.0.0';
var indexer_url = CONFIG('indexer_url') || '/api/indexer';

exports.install = function(options) {
  ROUTE(indexer_url, indexer_callback, ['post']);
}

function indexer_callback() {
  var self = this;
	if (!self.body.bundle) {
		self.success(false, 'Bundle not found.');
		return;
  }
  
  if (!self.body.index_type) {
		self.success(false, 'Indexer type not found.');
		return;
  }
  
  if (!self.body.fetch_url) {
		self.success(false, 'Fetch url not found.');
		return;
  }
  
	var db_name = self.body.bundle;
	var index_type = self.body.index_type;
  var id = self.body.id;
  var fetch_url = self.body.fetch_url;
	self.success();
	if (index_type == 'delete') {
    mongoose.connection.collection(db_name).deleteOne({ _id: id });
		return;
	}
	// Do update or create.
	RESTBuilder.make(builder => builder.url(fetch_url)).exec(function(err, doc) {
		if (err) {
			console.log('Error:', err);
			return;
		}
		doc.length > 0 && (doc = doc[0]);
		doc._id = doc.id;
    delete doc.id;
		mongoose.connection.collection(db_name).updateOne({ _id: id }, { $set: doc }, { upsert: true });
	});
}
