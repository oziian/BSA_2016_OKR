const router = require('express').Router();
const adminOnly = require('../adminOnly');
const repository = require('../../repositories/userObjective');
const session = require('../../config/session');
const service = require('../../services/userObjective');
const ValidateService = require('../../utils/ValidateService');
const HelpService = require('../../utils/HelpService');
const isCorrectId = ValidateService.isCorrectId;
const isEmpty = ValidateService.isEmpty;

router.post('/', (req, res, next) => {
	var title = req.body.title || '';
	var categoryId = req.body.categoryId || '';
	var quarterId = req.body.quarterId || '';
	// Not necessary field
	var objectiveId = req.body.objectiveId || '';
	var userId = req.session._id;
	var isApproved = false;

	if(isEmpty(title) || !isCorrectId(categoryId)
	|| !isCorrectId(quarterId)) {
		return res.badRequest();
	}

	if(req.session.isAdmin) {
		isApproved = true;
	}

	return service.add(userId, categoryId, quarterId, objectiveId, title, isApproved, res.callback)
});

router.get('/me/', (req, res, next) => {
	return repository.getByUserIdPopulate(req.session._id, res.callback);
});

router.get('/me/deleted', (req, res, next) => {

	return repository.getDeletedByUserIdPopulate(req.session._id, res.callback);
});


router.get('/user/:id', (req, res, next) => {
	var id = req.params.id;

	if(!ValidateService.isCorrectId(id)) {
		return res.badRequest();
	}

	return repository.getByUserIdPopulate(id, res.callback);
});

router.post('/:id/keyresult/', (req, res, next) => {
	let userObjectiveId = req.params.id || '';
	let userId = req.session._id;
	let isAdmin = req.session.isAdmin;
	let title = req.body.title || '';
	let keyResultId = req.body.keyResultId || '';
	let isApproved = false;

	let keyResultTitle = title.trim();

	if(!isCorrectId(userObjectiveId)
	|| (isEmpty(title) && isEmpty(keyResultId))
	|| (!isEmpty(keyResultId) && !isCorrectId(keyResultId))) {
		return res.badRequest();
	}

	if(req.session.isAdmin) {
		isApproved = true;
	}

	service.addKeyResult(userId, userObjectiveId, keyResultId, keyResultTitle, isApproved, res.callback);
});

router.put('/:id/keyresult/score', (req, res, next) => {
	let userId = req.session._id;
	let objectiveId = req.params.id || '';
	let keyResultId = req.body.keyResultId || '';
	let score = req.body.score || '';

	score = Number.parseFloat(score);

	if(!isCorrectId(objectiveId)
	|| !isCorrectId(keyResultId)
	|| Number.isNaN(score)) {
		return res.badRequest();
	}

	score = Number.parseFloat(score.toFixed(1));

	if (score < 0 || score > 1) {
		return res.badRequest('Score should be from 0.1 to 1.0');
	}

	service.setScoreToKeyResult(userId, objectiveId, keyResultId, score, res.callback);
});

// Soft delete key result from objective
router.delete('/:id/keyResult/:keyResultId/:flag', (req, res, next) => {
	var flag = req.params.flag || '';
	var userObjectiveId = req.params.id || '';
	var keyResultId = req.params.keyResultId || '';
	var session = req.session;

	if(!ValidateService.isCorrectId(userObjectiveId)
	|| !ValidateService.isStringBoolean(flag)
	|| !ValidateService.isCorrectId(keyResultId)) {
		return res.badRequest();
	}

	flag = HelpService.stringToBoolean(flag);

	return service.softDeleteKeyResult(session, userObjectiveId, keyResultId, flag, res.callback);
});

router.delete('/:id/:flag', (req, res, next) => {
	var flag = req.params.flag || '';
	var userObjectiveId = req.params.id || '';
	var session = req.session;

	if(!ValidateService.isCorrectId(userObjectiveId)
			|| !ValidateService.isStringBoolean(flag)) {
		return res.badRequest();
	}

	flag = HelpService.stringToBoolean(flag);

	return service.softDelete(session, userObjectiveId, flag, res.callback);
});

router.get('/:id', (req, res, next) => {
	var id = req.params.id;

	if(!isCorrectId(id)) {
		return res.badRequest();
	};

	return repository.getById(id, res.callback);
});

// TODO: Body validation
router.put('/:id', (req, res, next) => {
	var id = req.params.id;
	var body = req.body;

	if(!isCorrectId(id)) {
		return res.badRequest();
	};

	return service.update(session._id, id, body, res.callback);
});

module.exports = router;
