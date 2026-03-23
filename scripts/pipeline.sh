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
  echo "  ./scripts/pipeline.sh <clinic-website-url>       Scrape + draft email"
  echo "  ./scripts/pipeline.sh --discover \"City, ST\"      Find clinics in an area"
  echo "  ./scripts/pipeline.sh --discover \"City\" --scrape  Find + scrape + draft"
  echo "  ./scripts/pipeline.sh --draft [slug]              Draft emails only"
  echo "  ./scripts/pipeline.sh --draft                     Draft all pending"
  echo ""
  echo "Examples:"
  echo "  ./scripts/pipeline.sh https://rescore.com"
  echo "  ./scripts/pipeline.sh --discover \"Austin, TX\""
  echo "  ./scripts/pipeline.sh --discover \"Miami, FL\" --scrape"
  echo "  ./scripts/pipeline.sh --draft rescore"
  echo ""
  exit 1
fi

# Discovery mode
if [ "$1" == "--discover" ]; then
  shift
  LOCATION=$1
  shift
  echo ""
  echo "🔍 Discovering clinics in: $LOCATION"
  echo ""
  npx ts-node scripts/discover-clinics.ts "$LOCATION" $@
  exit 0
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
