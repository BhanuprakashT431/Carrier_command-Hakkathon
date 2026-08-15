'use strict';

const ProfileService = require('../services/profile.service');
const { success } = require('../utils/response');

class ProfileController {
  static async getProfile(req, res, next) {
    try {
      const profile = await ProfileService.getFullProfile(req.user.userId);
      if (!profile) {
        return success(res, null, 'Profile not yet created');
      }
      return success(res, profile, 'Profile retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const updated = await ProfileService.updateProfile(req.user.userId, req.body);
      return success(res, updated, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }

  // --- EDUCATION ---
  static async addEducation(req, res, next) {
    try {
      const result = await ProfileService.addEducation(req.user.userId, req.body);
      return success(res, result, 'Education added', 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateEducation(req, res, next) {
    try {
      const { id } = req.params;
      await ProfileService.updateEducation(req.user.userId, id, req.body);
      return success(res, null, 'Education updated');
    } catch (err) {
      next(err);
    }
  }

  static async deleteEducation(req, res, next) {
    try {
      const { id } = req.params;
      await ProfileService.deleteEducation(req.user.userId, id);
      return success(res, null, 'Education deleted', 204);
    } catch (err) {
      next(err);
    }
  }

  // --- SKILLS ---
  static async addSkill(req, res, next) {
    try {
      const result = await ProfileService.addSkill(req.user.userId, req.body);
      return success(res, result, 'Skill added', 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateSkill(req, res, next) {
    try {
      const { id } = req.params;
      await ProfileService.updateSkill(req.user.userId, id, req.body);
      return success(res, null, 'Skill updated');
    } catch (err) {
      next(err);
    }
  }

  static async deleteSkill(req, res, next) {
    try {
      const { id } = req.params;
      await ProfileService.deleteSkill(req.user.userId, id);
      return success(res, null, 'Skill deleted', 204);
    } catch (err) {
      next(err);
    }
  }

  // --- PROJECTS ---
  static async addProject(req, res, next) {
    try {
      const result = await ProfileService.addProject(req.user.userId, req.body);
      return success(res, result, 'Project added', 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      await ProfileService.updateProject(req.user.userId, id, req.body);
      return success(res, null, 'Project updated');
    } catch (err) {
      next(err);
    }
  }

  static async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      await ProfileService.deleteProject(req.user.userId, id);
      return success(res, null, 'Project deleted', 204);
    } catch (err) {
      next(err);
    }
  }

  // --- CERTIFICATIONS ---
  static async addCertification(req, res, next) {
    try {
      const result = await ProfileService.addCertification(req.user.userId, req.body);
      return success(res, result, 'Certification added', 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateCertification(req, res, next) {
    try {
      const { id } = req.params;
      await ProfileService.updateCertification(req.user.userId, id, req.body);
      return success(res, null, 'Certification updated');
    } catch (err) {
      next(err);
    }
  }

  static async deleteCertification(req, res, next) {
    try {
      const { id } = req.params;
      await ProfileService.deleteCertification(req.user.userId, id);
      return success(res, null, 'Certification deleted', 204);
    } catch (err) {
      next(err);
    }
  }

  // --- PREFERENCES & GOALS ---
  static async updatePreferences(req, res, next) {
    try {
      const result = await ProfileService.updatePreferences(req.user.userId, req.body);
      return success(res, result, 'Career preferences updated');
    } catch (err) {
      next(err);
    }
  }

  static async updateGoals(req, res, next) {
    try {
      // Expects array of goals
      const goalsArray = Array.isArray(req.body) ? req.body : [req.body];
      const result = await ProfileService.updateGoals(req.user.userId, goalsArray);
      return success(res, result, 'Career goals updated');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProfileController;
