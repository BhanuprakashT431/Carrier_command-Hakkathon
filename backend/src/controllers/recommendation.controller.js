const RecommendationService = require('../services/recommendation.service');
const { success, error } = require('../utils/response');

exports.getCurrent = async (req, res) => {
  try {
    const result = await RecommendationService.getCurrentRecommendation(req.user.userId);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getChanges = async (req, res) => {
  try {
    const result = await RecommendationService.detectRecommendationChange(req.user.userId);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 500);
  }
};
