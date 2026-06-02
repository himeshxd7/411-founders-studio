"use server";

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const runWithDiagnostics = async <T>(name: string, fn: () => Promise<T>) => {
  try {
    const result = await fn();
    // Wrap the result in the success object the UI expects
    return { success: true, data: result }; 
  } catch (error: any) {
    console.error(`${name} failed`, error);
    // Wrap the error so the UI can display it
    return { success: false, error: error.message || "Unknown error" }; 
  }
};

// Helper for Supabase Admin
const getSupabaseAdmin = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase environment variables are missing.');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
};

// ============================================================================
// ENGINE 1: FOUNDER INTELLIGENCE PIPELINE
// ============================================================================

export async function processFounderData(rawData: string) {
  return runWithDiagnostics('Engine 1: Founder Intelligence', async () => {
    const supabaseAdmin = getSupabaseAdmin();

    const { text } = await generateText({
      model: google('gemini-3.5-flash'), 
      system: `You are the 411 Club Founder Intelligence Agent. You operate with the cognitive patterns of a YC CEO and a Staff Engineer.
      
      GStack Rules of Engagement:
      1. Proxy Skepticism: Do not be impressed by vanity metrics, waitlists, or "passion". Reward concrete execution, actual revenue, and shipped code.
      2. Inversion Reflex: Before scoring high, ask "how would this founder fail?"
      3. Essential vs Accidental Complexity: Does this founder solve a real problem, or a hypothetical one they created?
      4. Anti-Sycophancy Voice: Builder-to-builder, direct, concrete. NEVER use words like: delve, crucial, robust, comprehensive, nuanced, ecosystem, tapestry, or synergy. No corporate PR.
      
      Before generating the JSON, internally evaluate their true edge. Output the final JSON strictly based on this rigorous standard.`,
      prompt: `Analyze the following founder profile data and score them strictly out of 100 on the 5 core dimensions. 
      Raw Data: ${rawData}
      You MUST respond ONLY with a raw, valid JSON object matching this exact structure:
      {
        "full_name": "string",
        "founder_type": "string",
        "audience_quality": "string",
        "score_theme_relevance": number,
        "score_community_contribution": number,
        "score_credibility": number,
        "score_influence": number,
        "score_culture_fit": number,
        "recommendation_level": "Highly Recommended" | "Recommended" | "Neutral" | "Low Priority" | "Reject",
        "recommendation_reasoning": "string"
      }`
    });

    const cleanJsonString = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const founderAnalysis = JSON.parse(cleanJsonString);

    const { data, error } = await supabaseAdmin
      .from('founders')
      .insert([{
        full_name: founderAnalysis.full_name,
        founder_type: founderAnalysis.founder_type,
        audience_quality: founderAnalysis.audience_quality,
        score_theme_relevance: founderAnalysis.score_theme_relevance,
        score_community_contribution: founderAnalysis.score_community_contribution,
        score_credibility: founderAnalysis.score_credibility,
        score_influence: founderAnalysis.score_influence,
        score_culture_fit: founderAnalysis.score_culture_fit,
        recommendation_level: founderAnalysis.recommendation_level,
        recommendation_reasoning: founderAnalysis.recommendation_reasoning,
        human_approval_status: 'PENDING'
      }]).select();

    if (error) throw new Error(`Supabase Insert Error: ${error.message}`);

    revalidatePath('/');
    return data[0];
  });
}

// ============================================================================
// ENGINE 2: CONTENT STRATEGY
// ============================================================================

export async function processContentStrategy(eventTheme: string) {
  return runWithDiagnostics('Engine 2: Content Strategy', async () => {
    const supabaseAdmin = getSupabaseAdmin();

    const { text } = await generateText({
      model: google('gemini-3.5-flash'), 
      system: `You are the 411 Club Content Strategy Agent. You operate with the cognitive patterns of a Principal Product Designer.
      
      GStack Rules of Engagement:
      1. Subtraction Default: As little design/text as possible. Every word must earn its place. Cut happy talk.
      2. AI Slop Blacklist: NEVER recommend generic SaaS 3-column feature grids, purple gradients, floating blobs, or cookie-cutter hero sections. 
      3. Design for Trust: Every visual and copy decision either builds or erodes trust with top-tier developers and founders. 
      4. Anti-Sycophancy Voice: Direct, concrete, builder-to-builder. NEVER use words like: delve, crucial, robust, comprehensive, ecosystem, or synergy.
      
      Before generating the strategy, internally ask: "Would a top-tier bootstrapped founder actually respect this, or does it look like cheap AI marketing?" Output the final JSON strictly based on this standard.`,
      prompt: `Create a viral Instagram Reel strategy for the following 411 Club event theme.
      Event Theme: ${eventTheme}
      You MUST respond ONLY with a raw, valid JSON object matching this exact structure:
      {
        "content_type": "reel",
        "strategic_objective": "string",
        "hook_text": "string",
        "caption_body": "string",
        "visual_asset_direction": "string"
      }`
    });

    const cleanJsonString = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const strategyData = JSON.parse(cleanJsonString);

    const { data, error } = await supabaseAdmin
      .from('content_memory')
      .insert([{
        content_type: strategyData.content_type,
        strategic_objective: strategyData.strategic_objective,
        hook_text: strategyData.hook_text,
        caption_body: strategyData.caption_body,
        visual_asset_url: `PENDING_GENERATION: ${strategyData.visual_asset_direction}`, 
        human_approval_status: 'PENDING'
      }]).select();

    if (error) throw new Error(`Supabase Insert Error: ${error.message}`);

    revalidatePath('/');
    return data[0];
  });
}

// ============================================================================
// ENGINE 3: EVENT CURATION & REGISTRATION ANALYSIS
// ============================================================================

export async function processEventCuration(registrantData: string, eventTheme: string) {
  return runWithDiagnostics('Engine 3: Event Curation', async () => {
    const { text } = await generateText({
      model: google('gemini-3.5-flash'), 
      system: `You are the 411 Club Event Curation Agent. You operate with the cognitive patterns of a ruthless YC Partner and an elite Community Architect.
      
      GStack Rules of Engagement:
      1. Protect the Trust Density: It is better to have an empty seat than a net-negative attendee.
      2. Filter Tourists & Sycophants: Reject wantrepreneurs, agency owners disguised as tech founders, and aggressive salespeople.
      3. Specificity matching: Does this person specifically map to the event theme, or are they just looking to "network"?
      4. Anti-Sycophancy Voice: Direct, builder-to-builder. NEVER use words like: delve, crucial, robust, comprehensive, ecosystem, or synergy.
      
      Before generating the JSON, internally ask: "Would the best founder in the room be annoyed if this person sat next to them?" Output the final JSON strictly based on this standard.`,
      prompt: `Evaluate the following registrant for the specific event theme.
      Event Theme: ${eventTheme}
      Registrant Data: ${registrantData}
      You MUST respond ONLY with a raw, valid JSON object matching this exact structure:
      {
        "full_name": "string",
        "decision": "Approved" | "Waitlisted" | "Rejected",
        "collaboration_potential_score": number,
        "sales_risk_flag": boolean,
        "curation_reasoning": "string"
      }`
    });

    const cleanJsonString = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const curationData = JSON.parse(cleanJsonString);

    // Note: Mocking DB insert until table is created
    revalidatePath('/');
    return curationData; 
  });
}

// ============================================================================
// ENGINE 4: MEDIA GENERATION STUDIO (GStack Art Director + Hugging Face)
// ============================================================================

export async function processMediaGeneration(visualDirection: string) {
  return runWithDiagnostics('Engine 4: Media Generation', async () => {
    
    // 1. Generate the GStack Brief with Gemini
    const { text } = await generateText({
      model: google('gemini-3.5-flash'), 
      system: `You are the 411 Club Media Generation Architect. You operate with the cognitive patterns of a GStack Principal Designer and a high-end Cinematographer.
      
      GStack Rules of Engagement:
      1. AI Slop Blacklist: NEVER recommend generic SaaS neon, purple gradients, floating 3D blobs, or cookie-cutter isometric illustrations.
      2. Brutalist & Tactile: Favor raw, high-contrast, tactile, and cinematic realism.
      3. Anti-Sycophancy Voice: Direct, concrete. NEVER use words like: delve, crucial, robust.`,
      prompt: `Transform the following visual direction into a production-ready creative brief.
      Visual Direction: ${visualDirection}
      You MUST respond ONLY with a raw, valid JSON object matching this exact structure:
      {
        "asset_type": "Image",
        "cinematic_prompt": "string (A highly detailed, raw prompt)",
        "api_image_prompt": "string (Maximum 150 characters. ONLY English words and spaces. No punctuation.)",
        "typography_rules": "string (Specific font styles)",
        "vibe_check": "string (Why this builds trust)"
      }`
    });

    const cleanJsonString = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const mediaData = JSON.parse(cleanJsonString);

    // 2. Fetch the Image Securely from Hugging Face (FLUX.1-schnell)
    console.log("[DIAGNOSTIC] 🎨 Calling Hugging Face GPU...");
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: mediaData.api_image_prompt }),
      }
    );

    if (!hfResponse.ok) {
      throw new Error(`Hugging Face API failed: ${hfResponse.status} ${hfResponse.statusText}`);
    }

    // Convert the raw image buffer to a Base64 string for the UI
    const arrayBuffer = await hfResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const finalImageUrl = `data:image/jpeg;base64,${base64Image}`;

    revalidatePath('/');
    
    // Return both the JSON brief AND the finished image string
    return { ...mediaData, rendered_image: finalImageUrl }; 
  });
}