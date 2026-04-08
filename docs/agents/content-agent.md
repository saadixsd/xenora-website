# Content Agent

## Purpose

Turn a founder's raw thoughts, voice memos, build logs, or unstructured notes into publish-ready social content across X, LinkedIn, and Instagram.

## Connected APIs

| Platform  | API              | Scopes / Permissions                         |
|-----------|------------------|----------------------------------------------|
| X         | X API v2         | `tweet.read`, `tweet.write`, `users.read`    |
| Instagram | Graph API        | `instagram_basic`, `instagram_content_publish`|
| LinkedIn  | LinkedIn API     | `r_liteprofile`, `w_member_social`           |

## Data Fetched (per run, last 14 days)

- Post text and media type
- Impressions and reach
- Engagement rate (likes, replies, reposts, saves)
- Publish time and day of week
- Follower count at time of post

## Claude Prompt Structure

1. **Analyze performance** -- identify which post formats, hooks, and topics drove the highest engagement in the last 14 days.
2. **Identify patterns** -- surface recurring themes, optimal posting times, and voice characteristics.
3. **Generate ideas** -- produce 5-10 post ideas in the founder's voice, formatted per platform.

System prompt template:

```
You are the Content Agent for a solo founder. You have access to their last 14 days
of social performance data across X, Instagram, and LinkedIn.

Analyze the data. Identify the top-performing formats and topics. Then generate
{count} post ideas formatted for each platform.

Write in the founder's voice: {tone}. Be direct, sharp, no fluff.
Do not use hashtags. Do not use emojis unless the founder's data shows they work.
```

## Output JSON

```json
{
  "posts": [
    {
      "platform": "x",
      "hook": "Short opening line that stops the scroll",
      "body": "Full post body (280 chars max for X)",
      "cta": "Call to action",
      "suggested_time": "2026-04-09T09:00:00Z",
      "format": "thread_opener | single | quote_retweet"
    }
  ],
  "performance_summary": {
    "top_format": "thread_opener",
    "best_day": "Tuesday",
    "best_time": "09:00 UTC",
    "avg_engagement_rate": 0.034
  }
}
```

## UI After a Run

- Posts grouped by platform in a tabbed view (X / LinkedIn / Instagram)
- Each post card shows: hook preview, full text expandable, suggested publish time
- Action buttons: Edit, Approve, Schedule, Dismiss
- Performance summary card at the top showing patterns found
- User must approve before anything publishes

## Hours Saved Estimate

15 minutes per run (replaces: reading analytics, brainstorming, writing, formatting per platform).
