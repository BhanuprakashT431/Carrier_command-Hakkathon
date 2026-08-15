const MilestoneService = require('../services/milestone.service');
const { success, error } = require('../utils/response');

exports.getMilestones = async (req, res) => {
  try {
    const result = await MilestoneService.getMilestones(req.user.userId, req.query);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getWeeklyPlan = async (req, res) => {
  try {
    const result = await MilestoneService.generateWeeklyPlan(req.user.userId);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.startMilestone = async (req, res) => {
  try {
    const result = await MilestoneService.startMilestone(req.user.userId, req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

exports.completeMilestone = async (req, res) => {
  try {
    const result = await MilestoneService.completeMilestone(req.user.userId, req.params.id, req.body);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

exports.skipMilestone = async (req, res) => {
  try {
    const result = await MilestoneService.skipMilestone(req.user.userId, req.params.id, req.body);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 400);
  }
};
