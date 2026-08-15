'use strict';

const prisma = require('../config/database');

/**
 * Calculates a profile completeness percentage (0-100).
 * Checks presence of relations and fields.
 */
function calculateCompleteness(profile) {
  let score = 0;
  let total = 6; // Basic Profile, Education, Skills, Projects, Certifications, Goals

  if (profile.firstName && profile.lastName) score += 1;
  if (profile.education && profile.education.length > 0) score += 1;
  if (profile.userSkills && profile.userSkills.length > 0) score += 1;
  if (profile.projects && profile.projects.length > 0) score += 1;
  if (profile.certifications && profile.certifications.length > 0) score += 1;
  if (profile.careerGoals && profile.careerGoals.length > 0) score += 1;
  // Note: preferences could be added as well

  return Math.round((score / total) * 100);
}

class ProfileService {
  /**
   * Retrieves the full profile with all relations and completeness score.
   */
  static async getFullProfile(userId) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        education: true,
        experiences: true,
        projects: true,
        certifications: true,
        userSkills: true,
        careerPreference: true,
        careerGoals: true,
      },
    });

    if (!profile) return null;

    const completeness = calculateCompleteness(profile);
    return { ...profile, completeness };
  }

  /**
   * Update base profile fields and handle nested relations if provided
   */
  static async updateProfile(userId, updateData) {
    const { education, userSkills, projects, certifications, careerPreference, careerGoals, preferences, goals, skills, experiences, ...baseData } = updateData;

    // First update the base profile
    const profile = await prisma.profile.update({
      where: { userId },
      data: baseData,
    });

    const overwriteRelation = async (model, dataArray, mappingFn) => {
      await model.deleteMany({ where: { profileId: profile.id } });
      if (dataArray && dataArray.length > 0) {
        const cleanedData = dataArray.map(item => {
          const { id, profileId, createdAt, updatedAt, ...rest } = item;
          const mapped = mappingFn ? mappingFn(rest) : rest;
          return { ...mapped, profileId: profile.id };
        });
        await model.createMany({ data: cleanedData });
      }
    };

    if (education) {
      await overwriteRelation(prisma.education, education, (edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        branch: edu.fieldOfStudy || edu.branch,
        graduationYear: edu.endDate ? parseInt(edu.endDate.split('-')[0]) : edu.graduationYear,
      }));
    }
    
    // frontend might send 'skills' instead of 'userSkills'
    // Also frontend sends array of strings for skills sometimes? Let's check: SkillsStep sends array of objects or strings?
    // In ResumeUploader it was `intelligence.extractedFacts.skills.map`. Wait, if they are strings, we map to { skillName: s, proficiency: 'INTERMEDIATE', confidence: 50 }
    const skillsData = skills || userSkills;
    if (skillsData) {
      await overwriteRelation(prisma.userSkill, skillsData, (skill) => {
        if (typeof skill === 'string') return { skillName: skill, proficiency: 'INTERMEDIATE', confidence: 50 };
        return {
          skillName: skill.skillName || skill.name || 'Unknown',
          proficiency: skill.proficiency || 'INTERMEDIATE',
          confidence: skill.confidence || 50
        };
      });
    }
    
    if (projects) {
      await overwriteRelation(prisma.project, projects, (proj) => ({
        name: proj.name || proj.title,
        description: proj.description,
        role: proj.role,
        duration: proj.duration || proj.startDate,
        githubUrl: proj.link || proj.githubUrl,
      }));
    }

    if (certifications) await overwriteRelation(prisma.certification, certifications, (cert) => ({
      name: cert.name,
      issuer: cert.issuer || cert.organization,
      credentialUrl: cert.credentialUrl || cert.link,
    }));

    if (updateData.experiences) {
      await overwriteRelation(prisma.experience, updateData.experiences, (exp) => ({
        company: exp.company,
        role: exp.role || exp.title,
        type: exp.type || 'FULL_TIME',
        startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        isCurrent: exp.isCurrent || false,
        description: exp.description,
      }));
    }

    if (preferences || careerPreference) {
      const prefData = preferences || careerPreference;
      // Map frontend fields to DB fields if needed
      const mappedPref = {
        interestedRoles: JSON.stringify(prefData.jobTitle ? [prefData.jobTitle] : (prefData.interestedRoles || [])),
        preferredLocations: JSON.stringify(prefData.location ? [prefData.location] : (prefData.preferredLocations || [])),
        remotePreference: prefData.remote !== undefined ? (prefData.remote ? 'REMOTE' : 'ON_SITE') : prefData.remotePreference,
        salaryExpectation: prefData.salary ? Number(prefData.salary) : prefData.salaryExpectation,
        industries: JSON.stringify(prefData.industries || []),
      };

      await prisma.careerPreference.upsert({
        where: { profileId: profile.id },
        update: mappedPref,
        create: { ...mappedPref, profileId: profile.id },
      });
    }

    const goalsData = goals || careerGoals;
    if (goalsData) {
      let mappedGoals = [];
      if (Array.isArray(goalsData)) {
        mappedGoals = goalsData;
      } else {
        // Frontend sends { shortTerm: '', longTerm: '' }
        if (goalsData.shortTerm) mappedGoals.push({ timeframe: 'Short Term', goal: goalsData.shortTerm });
        if (goalsData.longTerm) mappedGoals.push({ timeframe: 'Long Term', goal: goalsData.longTerm });
      }
      await overwriteRelation(prisma.careerGoal, mappedGoals);
    }

    return this.getFullProfile(userId);
  }

  /**
   * UPSERT Career Preferences
   */
  static async updatePreferences(userId, data) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    return await prisma.careerPreference.upsert({
      where: { profileId: profile.id },
      update: data,
      create: { ...data, profileId: profile.id },
    });
  }

  /**
   * OVERWRITE Career Goals (replaces all existing goals for user)
   */
  static async updateGoals(userId, goalsArray) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    // Delete existing
    await prisma.careerGoal.deleteMany({
      where: { profileId: profile.id },
    });

    if (!goalsArray || goalsArray.length === 0) return [];

    // Create new
    await prisma.careerGoal.createMany({
      data: goalsArray.map((g) => ({ ...g, profileId: profile.id })),
    });

    return await prisma.careerGoal.findMany({ where: { profileId: profile.id } });
  }

  // --- CRUD for EDUCATION ---
  static async addEducation(userId, data) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.education.create({ data: { ...data, profileId: profile.id } });
  }

  static async updateEducation(userId, id, data) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.education.updateMany({
      where: { id, profileId: profile.id }, // Ensures ownership
      data,
    });
  }

  static async deleteEducation(userId, id) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.education.deleteMany({
      where: { id, profileId: profile.id },
    });
  }

  // --- CRUD for SKILLS ---
  static async addSkill(userId, data) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.userSkill.create({ data: { ...data, profileId: profile.id } });
  }

  static async updateSkill(userId, id, data) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.userSkill.updateMany({
      where: { id, profileId: profile.id },
      data,
    });
  }

  static async deleteSkill(userId, id) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.userSkill.deleteMany({
      where: { id, profileId: profile.id },
    });
  }

  // --- CRUD for PROJECTS ---
  static async addProject(userId, data) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.project.create({ data: { ...data, profileId: profile.id } });
  }

  static async updateProject(userId, id, data) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.project.updateMany({
      where: { id, profileId: profile.id },
      data,
    });
  }

  static async deleteProject(userId, id) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.project.deleteMany({
      where: { id, profileId: profile.id },
    });
  }

  // --- CRUD for CERTIFICATIONS ---
  static async addCertification(userId, data) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.certification.create({ data: { ...data, profileId: profile.id } });
  }

  static async updateCertification(userId, id, data) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.certification.updateMany({
      where: { id, profileId: profile.id },
      data,
    });
  }

  static async deleteCertification(userId, id) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return await prisma.certification.deleteMany({
      where: { id, profileId: profile.id },
    });
  }
}

module.exports = ProfileService;
