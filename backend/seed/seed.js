var seedCollections = require('./seedCollections');
var util = require('util');
var mongoose = require('mongoose');
var async = require('async');

// ---=== LOCAL DB ===---
mongoose.connect('mongodb://localhost:27017/okr-app');

// ---=== REMOTE DB ===---
// var uri= 'mongodb://dbuser:111111@ds029565.mlab.com:29565/okr';
// var opts= {
//  server: {
//   socketOptions: {
//    keepAlive: 1,
//    connectTimeoutMS: 30000
//   }
//  }
// };

mongoose.connect(uri, opts);

mongoose.connection.once('open', () => {
	var items = seedCollections();
	seed(items);
});

function seed(items) {
	async.forEach(mongoose.connection.collections, function (collection, done) {
		collection.drop(function (err) {
			if (err && err.message != 'ns not found') {
				done(err);
			}

			console.log('Collection ' + collection.name + ' dropped successfully');

			var seedItems = items[collection.name];
			if (seedItems) {
				collection.insertMany(seedItems, (err) => {
					if (err) {
						console.log(`Error inserting into ${collection.name}`);
						console.log(err);
					}
					else {
						console.log(`${seedItems.length} item inserted into ${collection.name}`);
					}
					done(err);
				});
			}
			else {
				done(err);
			}
		});
	}, (err, result) => {
		if (!err) {
			console.log('All collections dropped and seeded');
			mongoose.connection.close();
		} else {
			console.log(err);
		}
	});
}