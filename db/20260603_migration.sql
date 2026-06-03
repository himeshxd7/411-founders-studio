-- Enable UUID extension for primary keys
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- ==========================================
  -- 1. STARTUPS TABLE (Ecosystem Intelligence)
  -- ==========================================
  CREATE TABLE startups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    industry TEXT,
    niche TEXT,
    category TEXT, -- e.g., healthtech, AI startup, D2C
    business_model TEXT,
    stage TEXT,
    years_active INTEGER,
    funding_signals TEXT,
    traction_indicators TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- ==========================================
  -- 2. FOUNDERS TABLE (The Core Memory Bank)
  -- ==========================================
  CREATE TABLE founders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID REFERENCES startups(id) ON DELETE SET NULL,
    
    -- Core Identification
    full_name TEXT NOT NULL,
    founder_type TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    
    -- Intelligence & Enrichment (Browser-Assisted via Playwright)
    audience_quality TEXT,
    ecosystem_visibility TEXT,
    community_ownership TEXT,
    
    -- THE 5-DIMENSION SCORING ENGINE (0-100)
    score_theme_relevance INTEGER CHECK (score_theme_relevance BETWEEN 0 AND 100),
    score_community_contribution INTEGER CHECK (score_community_contribution BETWEEN 0 AND 100),
    score_credibility INTEGER CHECK (score_credibility BETWEEN 0 AND 100),
    score_influence INTEGER CHECK (score_influence BETWEEN 0 AND 100),
    score_culture_fit INTEGER CHECK (score_culture_fit BETWEEN 0 AND 100),
    
    -- AI Recommendations & Logic
    recommendation_level TEXT 
      CHECK (recommendation_level IN ('Highly Recommended', 'Recommended', 'Neutral', 'Low Priority', 'Reject')),
    recommendation_reasoning TEXT,
    
    -- HUMAN-IN-THE-LOOP (HITL) APPROVAL STATUS
    human_approval_status TEXT DEFAULT 'PENDING' 
      CHECK (human_approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- ==========================================
  -- 3. EVENTS & REGISTRATIONS (Event Curation Engine)
  -- ==========================================
  CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theme_name TEXT NOT NULL,
    venue_context TEXT,
    target_founder_categories TEXT[], -- Array of desired niches (e.g., ['yoga', 'healthtech'])
    event_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    founder_id UUID NOT NULL REFERENCES founders(id) ON DELETE CASCADE,
    
    -- Registration Context
    registration_source TEXT DEFAULT 'Luma',
    event_specific_relevance_score INTEGER CHECK (event_specific_relevance_score BETWEEN 0 AND 100),
    registration_status TEXT DEFAULT 'WAITLIST'
      CHECK (registration_status IN ('APPROVED', 'WAITLIST', 'REJECTED')),
      
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- ==========================================
  -- 4. CONTENT MEMORY (Content Strategy Engine)
  -- ==========================================
  CREATE TABLE content_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    content_type TEXT CHECK (content_type IN ('reel', 'carousel', 'poster', 'meme', 'story')),
    strategic_objective TEXT, -- e.g., 'FOMO', 'Founder Aspiration', 'Urgency'
    hook_text TEXT,
    caption_body TEXT,
    visual_asset_url TEXT,
    
    -- Instagram Intelligence
    recommended_posting_time TIMESTAMPTZ,
    human_approval_status TEXT DEFAULT 'PENDING' 
      CHECK (human_approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
      
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- ==========================================
  -- 5. PERFORMANCE INDEXES & TRIGGERS
  -- ==========================================
  CREATE INDEX idx_founders_approval ON founders(human_approval_status);
  CREATE INDEX idx_founders_recommendation ON founders(recommendation_level);
  CREATE INDEX idx_startups_category ON startups(category);
  CREATE INDEX idx_registrations_event ON event_registrations(event_id);

  -- Universal Trigger Function for updated_at
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER update_startups_updated_at BEFORE UPDATE ON startups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER update_founders_updated_at BEFORE UPDATE ON founders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();