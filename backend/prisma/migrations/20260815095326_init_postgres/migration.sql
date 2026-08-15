-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "portfolioUrl" TEXT,
    "resumeUrl" TEXT,
    "resumeText" TEXT,
    "resumeFileName" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "branch" TEXT,
    "semester" TEXT,
    "graduationYear" INTEGER,
    "gpa" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "technologies" TEXT NOT NULL DEFAULT '[]',
    "role" TEXT,
    "duration" TEXT,
    "githubUrl" TEXT,
    "deploymentUrl" TEXT,
    "difficulty" TEXT,
    "outcome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issuedDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "credentialUrl" TEXT,
    "relevantSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skills" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "proficiency" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_preferences" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "interestedRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "industries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "salaryExpectation" INTEGER,
    "preferredLocations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "remotePreference" TEXT,
    "higherStudies" BOOLEAN NOT NULL DEFAULT false,
    "companyType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_goals" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "requiredSkills" TEXT NOT NULL,
    "avgSalaryMin" INTEGER,
    "avgSalaryMax" INTEGER,
    "growthRate" TEXT,
    "automationRisk" DOUBLE PRECISION,
    "demandLevel" TEXT,
    "source" TEXT,
    "sourceDate" TEXT,
    "dataMode" TEXT NOT NULL DEFAULT 'CURATED',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "currentPhase" TEXT,
    "currentAgent" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_runs" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "agentVersion" TEXT NOT NULL DEFAULT '1.0',
    "status" TEXT NOT NULL,
    "phase" INTEGER NOT NULL,
    "inputSummary" TEXT,
    "outputJson" JSONB,
    "confidence" DOUBLE PRECISION,
    "evidenceStrength" TEXT,
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "latencyMs" INTEGER,
    "modelUsed" TEXT,
    "toolsUsed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_decisions" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "career" TEXT NOT NULL,
    "suitabilityScore" DOUBLE PRECISION NOT NULL,
    "stressAdjustedScore" DOUBLE PRECISION NOT NULL,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "stressTestRobustness" DOUBLE PRECISION NOT NULL,
    "stabilityScore" DOUBLE PRECISION NOT NULL,
    "overallConfidence" DOUBLE PRECISION NOT NULL,
    "unsupportedClaimRate" DOUBLE PRECISION NOT NULL,
    "evidenceCoverage" DOUBLE PRECISION NOT NULL,
    "agentAgreementRate" DOUBLE PRECISION NOT NULL,
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "scoreDisclaimer" TEXT NOT NULL DEFAULT 'System-generated decision-support metrics based on configured scoring formulas. Not scientific probability assessments.',
    "strengths" JSONB NOT NULL DEFAULT '[]',
    "skillGaps" JSONB NOT NULL DEFAULT '[]',
    "risks" JSONB NOT NULL DEFAULT '[]',
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "alternativeCareers" JSONB NOT NULL DEFAULT '[]',
    "stressTestResults" JSONB NOT NULL DEFAULT '[]',
    "agentDisagreements" JSONB NOT NULL DEFAULT '[]',
    "assumptions" JSONB NOT NULL DEFAULT '[]',
    "uncertainties" JSONB NOT NULL DEFAULT '[]',
    "finalReasoning" TEXT NOT NULL DEFAULT '',
    "nextActions" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_gaps" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "career" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "currentLevel" DOUBLE PRECISION NOT NULL,
    "requiredLevel" DOUBLE PRECISION NOT NULL,
    "gapSize" DOUBLE PRECISION NOT NULL,
    "priority" TEXT NOT NULL,
    "difficulty" TEXT,
    "dependency" TEXT,
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_gaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stress_tests" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "robustnessScore" DOUBLE PRECISION NOT NULL,
    "scenariosSurvived" INTEGER NOT NULL,
    "scenariosFailed" INTEGER NOT NULL,
    "scenariosPartial" INTEGER NOT NULL,
    "totalScenarios" INTEGER NOT NULL DEFAULT 10,
    "instabilityDetected" BOOLEAN NOT NULL DEFAULT false,
    "stabilityDelta" DOUBLE PRECISION,
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stress_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stress_scenarios" (
    "id" TEXT NOT NULL,
    "stressTestId" TEXT NOT NULL,
    "scenarioId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "scoreDelta" DOUBLE PRECISION NOT NULL,
    "reasoning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stress_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_assessments" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "career" TEXT NOT NULL,
    "overallRisk" TEXT NOT NULL,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "automationRisk" DOUBLE PRECISION,
    "marketVolatility" DOUBLE PRECISION,
    "entryCompetition" DOUBLE PRECISION,
    "skillObsolescence" DOUBLE PRECISION,
    "geographicLimit" DOUBLE PRECISION,
    "factors" JSONB NOT NULL DEFAULT '[]',
    "mitigations" JSONB NOT NULL DEFAULT '[]',
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "risk_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "source" TEXT,
    "sourceDate" TEXT,
    "sourceType" TEXT,
    "confidence" DOUBLE PRECISION,
    "isSupported" BOOLEAN NOT NULL,
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eval_metrics" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "totalClaims" INTEGER NOT NULL DEFAULT 0,
    "supportedClaims" INTEGER NOT NULL DEFAULT 0,
    "unsupportedClaims" INTEGER NOT NULL DEFAULT 0,
    "unsupportedClaimRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "agentAgreementRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "stressTestRobustness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "avgAgentConfidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgAgentLatencyMs" INTEGER NOT NULL DEFAULT 0,
    "agentDisagreements" JSONB NOT NULL DEFAULT '[]',
    "apiFailed" BOOLEAN NOT NULL DEFAULT false,
    "usedDemoProvider" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eval_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_plans" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "career" TEXT NOT NULL,
    "day30Plan" JSONB NOT NULL DEFAULT '{}',
    "day60Plan" JSONB NOT NULL DEFAULT '{}',
    "day90Plan" JSONB NOT NULL DEFAULT '{}',
    "month6Plan" JSONB NOT NULL DEFAULT '{}',
    "resources" JSONB NOT NULL DEFAULT '[]',
    "totalDuration" TEXT,
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "dateApplied" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'APPLIED',
    "jobUrl" TEXT,
    "jobDescription" TEXT,
    "requiredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "salary" INTEGER,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "analysisId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_documents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceDate" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "career" TEXT,
    "skill" TEXT,
    "reliability" TEXT NOT NULL,
    "dataMode" TEXT NOT NULL DEFAULT 'CURATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "baseAnalysisId" TEXT NOT NULL,
    "scenarioType" TEXT NOT NULL,
    "scenarioParams" JSONB NOT NULL DEFAULT '{}',
    "originalScores" JSONB NOT NULL DEFAULT '{}',
    "simulatedScores" JSONB NOT NULL DEFAULT '{}',
    "rankingChanges" JSONB NOT NULL DEFAULT '[]',
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "copilot_conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Career Copilot',
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "copilot_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "copilot_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "intent" TEXT,
    "toolsUsed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dataUsed" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "actions" JSONB NOT NULL DEFAULT '[]',
    "evidence" TEXT NOT NULL DEFAULT '[]',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "limitations" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "copilot_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_snapshots" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "skills" JSONB NOT NULL DEFAULT '[]',
    "careerReadiness" DOUBLE PRECISION NOT NULL,
    "topCareer" TEXT,
    "suitabilityScore" DOUBLE PRECISION,
    "stressAdjustedScore" DOUBLE PRECISION,
    "robustnessScore" DOUBLE PRECISION,
    "rankingSnapshot" JSONB NOT NULL DEFAULT '[]',
    "skillCoverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "learningProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "projectEvidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "certEvidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "experienceFactor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "scoreDisclaimer" TEXT NOT NULL DEFAULT 'System-generated career readiness score — not scientific probability.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_milestones" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "analysisId" TEXT,
    "career" TEXT,
    "skill" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationDays" INTEGER NOT NULL DEFAULT 7,
    "phase" INTEGER NOT NULL DEFAULT 30,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "skippedAt" TIMESTAMP(3),
    "notes" TEXT,
    "evidenceUrl" TEXT,
    "completionEvidence" JSONB NOT NULL DEFAULT '{}',
    "dataMode" TEXT NOT NULL DEFAULT 'DEMO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "education_profileId_idx" ON "education"("profileId");

-- CreateIndex
CREATE INDEX "experiences_profileId_idx" ON "experiences"("profileId");

-- CreateIndex
CREATE INDEX "projects_profileId_idx" ON "projects"("profileId");

-- CreateIndex
CREATE INDEX "certifications_profileId_idx" ON "certifications"("profileId");

-- CreateIndex
CREATE INDEX "user_skills_profileId_idx" ON "user_skills"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "user_skills_profileId_skillName_key" ON "user_skills"("profileId", "skillName");

-- CreateIndex
CREATE UNIQUE INDEX "career_preferences_profileId_key" ON "career_preferences"("profileId");

-- CreateIndex
CREATE INDEX "career_goals_profileId_idx" ON "career_goals"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "careers_name_key" ON "careers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "careers_slug_key" ON "careers"("slug");

-- CreateIndex
CREATE INDEX "careers_category_idx" ON "careers"("category");

-- CreateIndex
CREATE INDEX "analyses_userId_idx" ON "analyses"("userId");

-- CreateIndex
CREATE INDEX "analyses_status_idx" ON "analyses"("status");

-- CreateIndex
CREATE INDEX "agent_runs_analysisId_idx" ON "agent_runs"("analysisId");

-- CreateIndex
CREATE INDEX "agent_runs_agentName_idx" ON "agent_runs"("agentName");

-- CreateIndex
CREATE UNIQUE INDEX "career_decisions_analysisId_key" ON "career_decisions"("analysisId");

-- CreateIndex
CREATE INDEX "skill_gaps_analysisId_idx" ON "skill_gaps"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "stress_tests_analysisId_key" ON "stress_tests"("analysisId");

-- CreateIndex
CREATE INDEX "stress_scenarios_stressTestId_idx" ON "stress_scenarios"("stressTestId");

-- CreateIndex
CREATE UNIQUE INDEX "risk_assessments_analysisId_key" ON "risk_assessments"("analysisId");

-- CreateIndex
CREATE INDEX "evidence_analysisId_idx" ON "evidence"("analysisId");

-- CreateIndex
CREATE INDEX "evidence_isSupported_idx" ON "evidence"("isSupported");

-- CreateIndex
CREATE UNIQUE INDEX "eval_metrics_analysisId_key" ON "eval_metrics"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "learning_plans_analysisId_key" ON "learning_plans"("analysisId");

-- CreateIndex
CREATE INDEX "progress_userId_idx" ON "progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "progress_userId_type_itemId_key" ON "progress"("userId", "type", "itemId");

-- CreateIndex
CREATE INDEX "job_applications_userId_idx" ON "job_applications"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_analysisId_idx" ON "audit_logs"("analysisId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "knowledge_documents_category_idx" ON "knowledge_documents"("category");

-- CreateIndex
CREATE INDEX "knowledge_documents_career_idx" ON "knowledge_documents"("career");

-- CreateIndex
CREATE INDEX "knowledge_documents_skill_idx" ON "knowledge_documents"("skill");

-- CreateIndex
CREATE INDEX "simulations_userId_idx" ON "simulations"("userId");

-- CreateIndex
CREATE INDEX "simulations_baseAnalysisId_idx" ON "simulations"("baseAnalysisId");

-- CreateIndex
CREATE INDEX "copilot_conversations_userId_idx" ON "copilot_conversations"("userId");

-- CreateIndex
CREATE INDEX "copilot_messages_conversationId_idx" ON "copilot_messages"("conversationId");

-- CreateIndex
CREATE INDEX "progress_snapshots_userId_idx" ON "progress_snapshots"("userId");

-- CreateIndex
CREATE INDEX "progress_snapshots_snapshotDate_idx" ON "progress_snapshots"("snapshotDate");

-- CreateIndex
CREATE INDEX "learning_milestones_userId_idx" ON "learning_milestones"("userId");

-- CreateIndex
CREATE INDEX "learning_milestones_status_idx" ON "learning_milestones"("status");

-- CreateIndex
CREATE INDEX "learning_milestones_career_idx" ON "learning_milestones"("career");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_preferences" ADD CONSTRAINT "career_preferences_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_goals" ADD CONSTRAINT "career_goals_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_runs" ADD CONSTRAINT "agent_runs_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_decisions" ADD CONSTRAINT "career_decisions_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_gaps" ADD CONSTRAINT "skill_gaps_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stress_tests" ADD CONSTRAINT "stress_tests_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stress_scenarios" ADD CONSTRAINT "stress_scenarios_stressTestId_fkey" FOREIGN KEY ("stressTestId") REFERENCES "stress_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eval_metrics" ADD CONSTRAINT "eval_metrics_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_plans" ADD CONSTRAINT "learning_plans_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress" ADD CONSTRAINT "progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_baseAnalysisId_fkey" FOREIGN KEY ("baseAnalysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "copilot_conversations" ADD CONSTRAINT "copilot_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "copilot_messages" ADD CONSTRAINT "copilot_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "copilot_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_snapshots" ADD CONSTRAINT "progress_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_milestones" ADD CONSTRAINT "learning_milestones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
