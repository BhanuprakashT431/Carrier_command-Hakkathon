'use strict';

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
const prisma = require('../config/database');
const env = require('../config/env');

class ResumeService {
  /**
   * Safely deletes a file from disk.
   */
  static safeDeleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`Failed to delete file at ${filePath}:`, err);
    }
  }

  /**
   * Extracts text from PDF or DOCX file
   */
  static async extractText(filePath, mimetype) {
    try {
      let text = '';
      if (mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        text = data.text;
      } else if (
        mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ path: filePath });
        text = result.value;
      }
      return this.sanitizeText(text);
    } catch (error) {
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }

  /**
   * Sanitizes the extracted text. Removes potentially dangerous characters.
   */
  static sanitizeText(text) {
    if (!text) return '';
    // Strip control characters, allow standard whitespace, numbers, symbols, letters
    return text.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F]/g, '').trim();
  }

  /**
   * Main flow to process resume.
   * 1. Extract text.
   * 2. Send to AI.
   * 3. Delete file.
   * 4. Return Intelligence.
   */
  static async processResume(userId, file) {
    let extractedText = '';

    try {
      // 1. Extract text securely
      extractedText = await this.extractText(file.path, file.mimetype);

      if (!extractedText || extractedText.length < 50) {
        throw new Error('Resume contains too little text to analyze.');
      }

      // 2. Call python agent
      const aiResponse = await axios.post(`${env.AGENTS_SERVICE_URL}/analysis/resume`, {
        user_id: userId,
        resume_text: extractedText,
        data_mode: env.DEMO_MODE ? 'demo' : 'live',
      });

      const intelligence = aiResponse.data;

      // 3. Save resume text to profile temporarily if you want, or just return intelligence.
      // The instruction: "Do NOT automatically overwrite existing profile... Let the user choose"
      // But we can store `resumeFileName` in the profile just to show they uploaded one.
      await prisma.profile.update({
        where: { userId },
        data: {
          resumeFileName: file.originalname,
        },
      });

      return intelligence;
    } finally {
      // Ensure file is ALWAYS deleted, even if extraction or AI fails
      this.safeDeleteFile(file.path);
    }
  }

  static async deleteResume(userId) {
    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        resumeFileName: null,
      },
    });
    return profile;
  }
}

module.exports = ResumeService;
