const ProgressService = require('../services/progress.service');
const { success, error } = require('../utils/response');

exports.getProgress = async (req, res) => {
  try {
    const result = await ProgressService.getProgress(req.user.userId);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getSkillProgress = async (req, res) => {
  try {
    const result = await ProgressService.getSkillProgress(req.user.userId);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getCareerReadiness = async (req, res) => {
  try {
    const result = await ProgressService.getCareerReadiness(req.user.userId);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.updateSkillProgress = async (req, res) => {
  try {
    const result = await ProgressService.updateSkillProgress(req.user.userId, req.params.skillId, req.body);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 400);
  }
};
