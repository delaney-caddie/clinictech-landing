#!/bin/bash
# clinictech-pipeline.sh
# Scrape a clinic website and immediately draft the outreach email
#
# Usage: ./clinictech-pipeline.sh https://example-clinic.com
#
# This runs:
#   1. Scraper: extracts brand data, writes to Supabase, generates preview
#   2. Email drafter: generates personalized cold email with preview link
#
# Setup:
#   npm install @mendable/firecrawl-js @supabase/supabase-js dotenv typescript ts-node
#   cp .env.example .env.local  (fill in your keys)
#   chmod +x clinictech-pipeline.sh

set -e

if [ -z "$1" ]; then
  echo ""
  echo "ClinicTech Pipeline"
  echo "==================="
  echo ""
  echo "Usage:"
  echo "  ./clinictech-pipeline.sh <clinic-website-url>    Scrape + draft email"
  echo "  ./clinictech-pipeline.sh --draft [slug]          Draft emails only"
  echo "  ./clinictech-pipeline.sh --draft                 Draft all pending emails"
  echo ""
  echo "Examples:"
  echo "  ./clinictech-pipeline.sh https://rescore.com"
  echo "  ./clinictech-pipeline.sh --draft rescore"
  echo "  ./clinictech-pipeline.sh --draft"
  echo ""
  exit 1
fi

# Draft-only mode
if [ "$1" == "--draft" ]; then
  echo ""
  echo "📧 Drafting emails..."
  echo ""
  npx ts-node scripts/email-drafter.ts $2
  exit 0
fi

# Full pipeline: scrape + draft
URL=$1

echo ""
echo "🚀 ClinicTech Pipeline"
echo "======================"
echo "Target: $URL"
echo ""

# Step 1: Scrape
echo "Step 1/2: Scraping website..."
echo ""
SCRAPE_OUTPUT=$(npx ts-node scripts/scraper.ts "$URL" 2>&1)
echo "$SCRAPE_OUTPUT"

# Extract slug from output
SLUG=$(echo "$SCRAPE_OUTPUT" | grep "Slug:" | awk '{print $2}')

if [ -z "$SLUG" ]; then
  echo ""
  echo "❌ Could not extract slug from scraper output. Check for errors above."
  exit 1
fi

echo ""
echo "Step 2/2: Drafting email..."
echo ""
npx ts-node scripts/email-drafter.ts "$SLUG"

echo ""
echo "🎉 Pipeline complete for: $URL"
echo "   Preview: https://clinictech.io/preview/$SLUG"
echo ""
