'use strict';

const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const ProfileController = require('../controllers/profile.controller');

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// Profile base CRUD
router.get('/', ProfileController.getProfile);
router.put('/', ProfileController.updateProfile);

// Education CRUD
router.post('/education', ProfileController.addEducation);
router.put('/education/:id', ProfileController.updateEducation);
router.delete('/education/:id', ProfileController.deleteEducation);

// Skills CRUD
router.post('/skills', ProfileController.addSkill);
router.put('/skills/:id', ProfileController.updateSkill);
router.delete('/skills/:id', ProfileController.deleteSkill);

// Projects CRUD
router.post('/projects', ProfileController.addProject);
router.put('/projects/:id', ProfileController.updateProject);
router.delete('/projects/:id', ProfileController.deleteProject);

// Certifications CRUD
router.post('/certifications', ProfileController.addCertification);
router.put('/certifications/:id', ProfileController.updateCertification);
router.delete('/certifications/:id', ProfileController.deleteCertification);

// Preferences and Goals
router.put('/preferences', ProfileController.updatePreferences);
router.put('/career-goals', ProfileController.updateGoals);

module.exports = router;
