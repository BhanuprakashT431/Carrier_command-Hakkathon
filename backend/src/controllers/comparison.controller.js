'use strict';

const ComparisonService = require('../services/comparison.service');
const { success, error } = require('../utils/response');

class ComparisonController {
  static async compareCareers(req, res) {
    try {
      const { analysisId, careers } = req.body;
      const result = await ComparisonService.compareCareers(
        req.user.userId,
        analysisId,
        careers
      );
      return success(res, result, 'Comparison generated successfully');
    } catch (err) {
      return error(res, err.message, 400);
    }
  }
}

module.exports = ComparisonController;
