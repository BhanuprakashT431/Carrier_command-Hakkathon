'use strict';

const CopilotService = require('../services/copilot.service');
const { success, error } = require('../utils/response');

const MAX_MESSAGE_LENGTH = 2000;

exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    if (!message || typeof message !== 'string') {
      return error(res, 'Message is required', 400);
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return error(res, `Message must not exceed ${MAX_MESSAGE_LENGTH} characters`, 400);
    }
    const result = await CopilotService.sendMessage(req.user.userId, conversationId, message);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getConversations = async (req, res) => {
  try {
    const result = await CopilotService.getConversations(req.user.userId);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getConversation = async (req, res) => {
  try {
    const result = await CopilotService.getConversation(req.user.userId, req.params.id);
    return success(res, result);
  } catch (err) {
    // Unauthorized or not found → 400
    return error(res, err.message, 400);
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    await CopilotService.deleteConversation(req.user.userId, req.params.id);
    return success(res, { deleted: true });
  } catch (err) {
    return error(res, err.message, 400);
  }
};
