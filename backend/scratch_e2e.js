const axios = require('axios');
const fs = require('fs');

const API_BASE = 'http://localhost:5000/api';
let token = '';
let analysisId = '';

const delay = ms => new Promise(res => setTimeout(res, ms));

async function runE2E() {
  console.log('--- STARTING E2E VERIFICATION ---');

  // 1. AUTHENTICATION
  try {
    console.log('\n1. AUTHENTICATION');
    const { email, password } = { email: `test${Date.now()}@example.com`, password: "Password123!" };
    
    // Register
    await axios.post(`${API_BASE}/auth/register`, { email, password });
    console.log(`✅ Registered user: ${email}`);
    
    // Login
    const loginRes = await axios.post(`${API_BASE}/auth/login`, { email, password });
    token = loginRes.data.data.accessToken;
    console.log(`✅ Logged in successfully. Token obtained.`);
    
    // Axios instance with token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (err) {
    console.error('❌ Authentication failed:', err.response?.data || err.message);
    return;
  }

  // 2. PROFILE + RESUME (Simulated)
  try {
    console.log('\n2. PROFILE UPDATE');
    const profilePayload = {
        skills: [
          { name: 'Python', proficiency: 'EXPERT', confidence: 95 },
          { name: 'Machine Learning', proficiency: 'INTERMEDIATE', confidence: 75 },
          { name: 'Docker', proficiency: 'BEGINNER', confidence: 30 }
        ],
        projects: [
          { name: 'AI Chatbot', githubUrl: 'https://github.com/demo/chatbot' },
          { name: 'E-commerce API', githubUrl: 'https://github.com/demo/api' },
          { name: 'Portfolio', githubUrl: 'https://github.com/demo/portfolio' },
          { name: 'ML Pipeline', githubUrl: 'https://github.com/demo/ml' }
        ],
        certifications: [
          { name: 'AWS Certified Machine Learning', issuer: 'Amazon' }
        ],
        experiences: [
          { company: 'Tech Corp', role: 'Software Engineer', type: 'FULL_TIME', startDate: '2020-01-01', endDate: '2024-01-01', isCurrent: false }
        ],
        preferences: { jobTitle: 'Machine Learning Engineer', learningHours: 10 }
    };
    await axios.put(`${API_BASE}/profile`, profilePayload);
    console.log('✅ Profile updated.');
  } catch (err) {
    console.error('❌ Profile update failed:', err.response?.data || err.message);
  }

  // 3. ANALYSIS
  try {
    console.log('\n3. ANALYSIS (9-AGENT PIPELINE)');
    const analysisRes = await axios.post(`${API_BASE}/analysis/run`, {});
    analysisId = analysisRes.data.data.analysisId;
    console.log(`✅ Analysis initiated. ID: ${analysisId}`);
    
    // Poll for status
    let status = 'PENDING';
    while (status === 'PENDING' || status === 'RUNNING') {
      await delay(2000);
      const statusRes = await axios.get(`${API_BASE}/analysis/${analysisId}/status`);
      status = statusRes.data.data.status;
      console.log(`   Status: ${status}`);
    }
    
    const resultRes = await axios.get(`${API_BASE}/analysis/${analysisId}/results`);
    const results = resultRes.data.data;
    
    console.log(`✅ Analysis completed! AI Provider: ${results.metadata?.actual_provider || 'DemoProvider'}`);
  } catch (err) {
    console.error('❌ Analysis failed:', err.response?.data || err.message);
  }

  // 4. SIMULATOR
  if (analysisId) {
    try {
      console.log('\n4. SIMULATOR');
      const simPayload = {
        baseAnalysisId: analysisId,
        scenarioType: 'AI Automation'
      };
      const simRes = await axios.post(`${API_BASE}/simulations`, simPayload);
      console.log(`✅ Simulation completed. Response keys:`, Object.keys(simRes.data.data));
    } catch (err) {
      console.error('❌ Simulator failed:', err.response?.data || err.message);
    }
  }

  // 5. COPILOT
  try {
    console.log('\n5. COPILOT');
    const copilotRes = await axios.post(`${API_BASE}/copilot/message`, {
      message: 'What skills should I improve?',
      chatHistory: []
    });
    console.log(`✅ Copilot responded:`, copilotRes.data.data.answer.substring(0, 50) + '...');
    console.log(`   Data Mode: ${copilotRes.data.data.dataMode}`);
  } catch (err) {
    console.error('❌ Copilot failed:', err.response?.data || err.message);
  }

  // 6. COMPARISON
  if (analysisId) {
    try {
      console.log('\n6. COMPARISON');
      const compRes = await axios.post(`${API_BASE}/comparisons`, {
        analysisId,
        careers: ['Machine Learning Engineer', 'Data Scientist', 'Backend Developer']
      });
      console.log(`✅ Comparison completed. Recommended: ${compRes.data.data.recommendations.bestOverall}`);
    } catch (err) {
      console.error('❌ Comparison failed:', err.response?.data || err.message);
    }
  }

  // 7. PROGRESS
  try {
    console.log('\n7. PROGRESS');
    const readinessRes = await axios.get(`${API_BASE}/progress/career-readiness`);
    console.log(`✅ Readiness retrieved. Score: ${readinessRes.data.data.score}`);
    
    const weeklyPlanRes = await axios.get(`${API_BASE}/learning-plan/milestones/weekly-plan`);
    console.log(`✅ Weekly Plan retrieved. Total scheduled: ${weeklyPlanRes.data.data.totalScheduled} hours`);
  } catch (err) {
    console.error('❌ Progress failed:', err.response?.data || err.message);
  }

  console.log('\n--- E2E VERIFICATION COMPLETE ---');
}

runE2E();
