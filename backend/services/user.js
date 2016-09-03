var UserRepository = require('../repositories/user');
var QuarterRepository = require('../repositories/quarter');
var HistoryRepository = require('../repositories/history');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
const CONST = require('../config/constants');

var UserService = function() {};

UserService.prototype.getById = function(id, callback) {

	async.waterfall([
		(callback) => {
			UserRepository.getByIdPopulate(id, function(err, user) {
				if(err) {
					return callback(err, null);
				};

				if(!user) {
					var err = new Error('User not found');
					err.status = 400;
					return callback(err);
				}

				return callback(err, user);
			});
		},
		(user, callback) => {
			user = user.toObject();
			QuarterRepository.getByUserIdPopulate(id, (err, quarters) => {
				if(err) {
					return callback(err, null);
				}

				user.quarters = quarters;

				return callback(null, user);
			});
		}
	], (err, result) => {
		return callback(err, result);
	});
};

UserService.prototype.takeApprentice = function(userId, apprenticeId, userLocalRole, callback) {
  async.waterfall([
		(callback) => {
			if(userId == apprenticeId) {
				var err = new Error("You can't mentor yourself");
				err.status = 400;
				return callback(err);
			}
      if(userLocalRole == CONST.user.role.ADMIN || userLocalRole == CONST.user.role.MENTOR) {
        UserRepository.getById(apprenticeId, (err, myApprentice) => {
  				if(err) {
  					return callback(err, null);
  				}
  				return callback(null, myApprentice);
  			});
      } else {
				var err = new Error('You are not admin/mentor');
				err.status = 400;
				return callback(err);
			}
    }, (myApprentice, callback) => {
      if(myApprentice.mentor == null) {
        var body = {
          mentor: userId
        }
        UserRepository.update(apprenticeId, body, (err, apprentice) => {
  				if(err) {
  					return callback(err, null);
  				}
  				return callback(null, apprentice);
  			});
      } else {
				var err = new Error('This user already has mentor');
				err.status = 400;
				return callback(err);
			}
    }, (apprentice, callback) => {
        HistoryRepository.addApprenticeEvent(userId, apprenticeId, CONST.history.type.TOOK_APPRENTICE, (err, historyEvent) => {
  				if(err) {
  					return callback(err, null);
  				}
  				return callback(null, historyEvent);
  			});
      }
    ], (err, result) => {
  return callback(err, result);
});
};

UserService.prototype.removeApprentice = function(userId, apprenticeId, userLocalRole, callback) {
  async.waterfall([
		(callback) => {
			/*
			if(userId != apprenticeId) {
				var err = new Error("You can only remove your apprentices");
				err.status = 400;
				return callback(err);
			}
			*/
      if(userLocalRole == CONST.user.role.ADMIN || userLocalRole == CONST.user.role.MENTOR) {
        UserRepository.getById(apprenticeId, (err, myApprentice) => {
  				if(err) {
  					return callback(err, null);
  				}
  				return callback(null, myApprentice);
  			});
      } else {
				var err = new Error('You are not admin/mentor');
				err.status = 400;
				return callback(err);
			}
    }, (myApprentice, callback) => {
      if(myApprentice.mentor != null) {
        var body = {
          mentor: null
        }
        UserRepository.update(apprenticeId, body, (err, apprentice) => {
  				if(err) {
  					return callback(err, null);
  				}
  				return callback(null, apprentice);
  			});
      } else {
				var err = new Error("This doesn't mentor");
				err.status = 400;
				return callback(err);
			}
    }, (apprentice, callback) => {
        HistoryRepository.addApprenticeEvent(userId, apprenticeId, CONST.history.type.REMOVED_APPRENTICE, (err, historyEvent) => {
  				if(err) {
  					return callback(err, null);
  				}
  				return callback(null, historyEvent);
  			});
      }
    ], (err, result) => {
  return callback(err, result);
});
};

// UserService.prototype.add = function(authorId, user, callback){
//  	console.log('user default '+ user.objectives[0].keys[0].keyId );
//  	var newUser = Object.assign({}, user);
//  	newUser.objectives[0].keys[0].keyId = ObjectId(user.objectives[0].keys[0].keyId);
//  	newUser.objectives[0].category = ObjectId(user.objectives[0].category);
//  	newUser.objectives[0].objectiveId = ObjectId(user.objectives[0].objectiveId);

//  	console.log('============ \n' + newUser);
// 	async.waterfall([
// 	(callback) => {
// 		console.log('user before adding ' + user);
// 		UserRepository.add(user, function(err, user){
// 			if(err){
// 				return callback(err, null);
// 			};
// 			return callback(null, user);
// 		});
// 	},
// 	(user, callback) => {
// 		HistoryRepository.addUserEvent(authorId, user, "add User", (err) => {
// 			if(err){
// 				return callback(err, null);
// 			};
// 			return callback(null, user);
// 		})
// 	}
// 	], (err, result) => {
// 		return callback(err, result);
// 	});
// };

// UserService.prototype.update = function(authorId, userId, body, callback){
// 	async.waterfall([
// 	(callback) => {
// 		UserRepository.update(userId, body, function(err, user){
// 			if(err){
// 				return callback(err, null);
// 			};
// 			return callback(null, user);
// 		});
// 	},
// 	(user, callback) => {
// 		HistoryRepository.addUserEvent(authorId, userId, "update User", (err) => {
// 			if (err){
// 				return callback(err, null);
// 			};
// 			return callback(null, user);
// 		});
// 	}
// 	], (err, result) => {
// 		return callback(err, result);
// 	});
// };

// UserService.prototype.changeArchive = function (authorId, userId, objectiveId, callback) {
// 	 async.waterfall([
// 	 	(callback) => {
// 	 		UserRepository.getByObjId(objectiveId, (err, user) => {
// 	 			if(err){
// 	 				return callback(err, null);
// 	 			};
// 	 			return callback(null, user);
// 	 		})
// 	 	},
// 	 	(user, callback) => {
// 	 		UserRepository.update(user._id, {isArchived: !user.isArchived}, (err) => {
// 	 			if(err){
// 	 				return callback(err, null);
// 	 			};
// 	 			return callback(null, user);
// 	 		})
// 	 	},
// 	 	(user, callback) => {
// 	 		HistoryRepository.addUserEvent(authorId, userId, "archived obj", (err) => {
// 	 			if(err){
// 	 				return callback(err, null);
// 	 			};
// 	 			return callback(null, user);
// 	 		})
// 	 	}
// 	 ], (err, result) => {
// 		return callback(err, result);
// 	});
// }

//not used yet
// UserService.prototype.setToDeleted = function(id, callback){
// 	UserRepository.setToDeleted(id, function(err, user){
// 		if(err){
// 			return callback(err, null);
// 		};

// 		callback(err, user);
// 	});
// };

//not used yet
// UserService.prototype.setToNotDeleted = function(id, callback){
// 	UserRepository.setToNotDeleted(id, function(err, user){
// 		if(err){
// 			return callback(err, null);
// 		};

// 		callback(err, user);
// 	});
// }

// UserService.prototype.delete = function(authorId, userId, callback){
// 	async.waterfall([
// 		(callback) => {
// 			UserRepository.delete(userId, function(err, user){
// 				if(err){
// 					return callback(err, null);
// 				};
// 				return callback(null, user);
// 			});
// 		},
// 		(user, callback) => {
// 			HistoryRepository.addUserEvent(authorId, userId, "delete User", (err) => {
// 				if(err){
// 					return callback(err, null);
// 				};
// 				return callback(null);
// 			});
// 		},
// 		(callback) => {
// 			UserMentorRepository.getByUserId(userId, function(err, userMentors){
// 				if(err){
// 					return callback(err, null);
// 				};
// 				return callback(null, userMentors);
// 			});
// 		},
// 		(userMentors, callback) => {
// 			userMentors.forEach(function(userMentor, i , arr){
// 				UserMentorRepository.delete(userMentor._id, function(err){
// 					if(err){
// 						return callback(err, null);
// 					};
// 				});
// 			});
// 			return callback(null);
// 		},
// 		(callback) => {
// 			UserMentorRepository.getByMentorId(userId, function(err, userMentors){
// 				if(err){
// 					return callback(err, null);
// 				};
// 				return callback(null, userMentors);
// 			});
// 		},
// 		(userMentors, callback) => {
// 			userMentors.forEach(function(userMentor, i ,arr){
// 				UserMentorRepository.delete(userMentor._id, function(err){
// 					if(err){
// 						return callback(err, null);
// 					};
// 				});
// 			});
// 			return callback(null);
// 		}
// 	], (err, result) => {
// 		return callback(err, result);
// 	})
/*
	UserRepository.delete(id, function(err, user){
		if(err){
			return callback(err, null);
		};

		UserMentorRepository.getByUserId(id, function(err, userMentors){
			if(err){
				return callback(err, null);
			};
			userMentors.forEach(function(userMentor, i , arr){
				UserMentorRepository.delete(userMentor._id, function(err){
					if(err){
						return callback(err, null);
					};
				});
			});
		});

		UserMentorRepository.getByMentorId(id, function(err, userMentors){
			if(err){
				return callback(err, null);
			};

			userMentors.forEach(function(userMentor, i ,arr){
				UserMentorRepository.delete(userMentor._id, function(err){
					if(err){
						return callback(err, null);
					};
				});
			});
		});

		callback(err, user);
	});*/
// };

module.exports = new UserService();
