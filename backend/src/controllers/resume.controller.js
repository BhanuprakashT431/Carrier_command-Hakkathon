'use strict';

const ResumeService = require('../services/resume.service');
const { success } = require('../utils/response');

class ResumeController {
  static async uploadResume(req, res, next) {
    try {
      if (!req.file) {
        const { AppError } = require('../middleware/errorHandler');
        throw new AppError('No file uploaded.', 422);
      }

      // Process the resume
      const intelligence = await ResumeService.processResume(req.user.userId, req.file);

      // We log this in audit inside service or controller? We can do it via a generic audit middleware, 
      // but returning success is enough here.
      return success(res, intelligence, 'Resume successfully processed');
    } catch (err) {
      next(err);
    }
  }

  static async deleteResume(req, res, next) {
    try {
      await ResumeService.deleteResume(req.user.userId);
      return success(res, null, 'Resume deleted successfully', 204);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ResumeController;
