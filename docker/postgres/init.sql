-- PostgreSQL init script — runs once on first container start
-- Creates pgvector extension for RAG support in Phase 9+

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Test database for CI
CREATE DATABASE career_db_test;
GRANT ALL PRIVILEGES ON DATABASE career_db_test TO career_user;
