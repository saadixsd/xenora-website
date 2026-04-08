# Research Agent

## Purpose

Monitor public sources for pain signals, competitor mentions, and market trends relevant to the founder's niche. Score and rank findings. Feed actionable insights to the Content Agent (post ideas) and Leads Agent (reply context).

## Connected APIs / Sources

| Source         | API / Method         | Notes                                       |
|----------------|---------------------|----------------------------------------------|
| Reddit         | Reddit API (OAuth2) | Subreddit monitoring, comment threads        |
| X              | X API v2 search     | Keyword/hashtag monitoring                   |
| Web (optional) | Perplexity API      | Broader web search for niche topics          |

## Keyword / Topic Configuration

Stored in `agents.settings` as JSON:

```json
{
  "keywords": ["saas pricing", "founder burnout", "cold outreach"],
  "subreddits": ["r/SaaS", "r/startups", "r/Entrepreneur"],
  "x_searches": ["indie hacker AND pricing", "solo founder AND burnout"],
  "exclude": ["hiring", "job posting", "sponsored"]
}
```

Users configure these on the Agent Edit page under the Research Agent settings panel.

## Pain Signal Scoring

Each signal extracted from source material is scored on three dimensions:

| Dimension    | Weight | Description                                      |
|--------------|--------|--------------------------------------------------|
| Frequency    | 0.4    | How often this pain appears across sources        |
| Intensity    | 0.3    | Strength of language (frustration, urgency)       |
| Relevance    | 0.3    | How closely it matches the founder's niche/offer  |

Composite score = `(frequency * 0.4) + (intensity * 0.3) + (relevance * 0.3)`, normalized 0-100.

## Claude Prompt Structure

```
You are the Research Agent. You receive user notes and fetched content from
public sources (Reddit threads, X posts, web pages -- may be partial or truncated).

Extract distinct pain signals. For each:
- Quote or paraphrase the evidence
- Score frequency, intensity, and relevance (0-100 each)
- Suggest a content angle the founder could use

Group signals by theme. Flag any gaps, bias, or fetch failures.
```

## Output JSON

```json
{
  "pain_signals": [
    {
      "theme": "Pricing confusion",
      "score": 78,
      "frequency": 85,
      "intensity": 70,
      "relevance": 80,
      "evidence": "Multiple Reddit threads asking 'how do I price my SaaS'",
      "content_angle": "Post: 'The pricing framework I wish I had at $0 MRR'"
    }
  ],
  "content_angles": [
    "Thread: 3 pricing mistakes I made (and how I fixed them)",
    "Hot take: Why free tiers kill solo SaaS founders"
  ],
  "quotes_evidence": [
    { "source": "r/SaaS", "text": "I have no idea how to price...", "url": "..." }
  ],
  "relevance_rationale": "High relevance -- founder sells SaaS tools and pricing is a recurring pain for their ICP.",
  "caveats": "Reddit API returned partial data for 2 threads. X search rate-limited after 50 results.",
  "cross_agent_feed": {
    "content_agent": ["Pricing confusion angle", "Free tier debate"],
    "leads_agent": ["Mention pricing pain when replying to SaaS leads"]
  }
}
```

## Cross-Agent Data Flow

```
Research Agent
  |
  |--> Content Agent: post ideas derived from pain signals
  |     (stored in agents.settings.research_insights)
  |
  |--> Leads Agent: context snippets for reply personalization
        (stored in agents.settings.lead_context)
```

The Research Agent writes to a shared `research_insights` key in its own settings after each run. The Content Agent and Leads Agent read this on their next run to incorporate fresh market context.

## Run Schedule

- **Daily**: automated run at a user-configured time (default 06:00 UTC)
- **On demand**: user clicks "Run now" from the dashboard
- **Triggered**: after a Content Agent or Leads Agent run requests fresh context

## UI Elements

- Pain signals list sorted by composite score, expandable with evidence quotes
- Content angles as a copy-ready list
- Source attribution with links
- Caveats section (fetch failures, data gaps)
- "Feed to Content Agent" and "Feed to Leads Agent" action buttons
- Run history with diff view (what changed since last run)

## Hours Saved Estimate

25 minutes per run (replaces: manual Reddit browsing, X searching, note-taking, pattern synthesis).
