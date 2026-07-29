# Golf Tracker v3

A vanilla JavaScript golf handicap tracking application designed for GitHub Pages.

Golf Tracker v3 uses a Google Sheet as the single source of truth and calculates handicap information using a World Handicap System (WHS) compatible calculation engine.

---

# Features

## Dashboard

Displays:

- Current handicap
- Target handicap
- Total rounds
- Average score
- Average differential
- Player summaries

Supported players:

- Mike
- Johnny


---

## Round History

Displays every imported round:

- Date
- Player
- Course
- Score
- Rating
- Slope
- Score Differential
- Counting / Non-counting status


---

## Handicap Analysis

Provides:

- Current handicap breakdown
- Best differentials
- Counting rounds
- Non-counting rounds
- Dropped rounds
- Handicap improvement analysis


---

## Handicap Solver

Answers:

"What do I need to shoot to reach my target handicap?"

Supports:

- Mike target handicap: 10.0
- Johnny target handicap: 15.0

The solver considers:

- Current handicap
- Existing differentials
- Future replacement of weaker counting rounds


---

## Time Machine

Allows historical review:

- Handicap after each round
- Counting rounds at that time
- Historical progression


---

## Trend Charts

Displays:

- Handicap progression
- Score trends
- Differential trends

Uses:

- HTML Canvas
- No external libraries


---

# Project Structure
