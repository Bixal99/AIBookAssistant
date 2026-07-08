# Argus 2.0 — Halyo's Operational Intelligence Engine

**Zennore / Halyo — Founding Engineer Design Proposal (v2)**
**Status:** Draft for team review — supersedes v1, incorporates CTO-review feedback

---

## 1. The Market Problem

Every mainstream tool in this space — Jira, Linear, ClickUp, Notion — is fundamentally a
**system of record**: a place that stores what work exists and its current status. The analytics
bolted onto these tools (burndown charts, velocity graphs, workload widgets) are, without
exception, **backward-looking**. They tell you what already happened.

That creates a specific, recurring, expensive failure pattern in every engineering org, regardless
of team size:

- **Teams don't miss deadlines because data was missing. They miss them because nobody was
  continuously interpreting the data before the deadline arrived.** By the time a burndown chart
  visibly bends the wrong way, the sprint is usually already lost — the chart just confirms it,
  days too late to act on.
- **There's no closed loop.** Detecting a problem, understanding why it happened, forecasting
  where it's headed, and deciding what to do about it is currently a manual process that depends
  entirely on one sharp PM or EM noticing a pattern early. It doesn't scale, it's inconsistent
  across teams, and it evaporates the moment that person is out sick or overloaded.
- **Strategy and execution silently drift apart.** Leadership sets goals/OKRs; engineering
  executes tickets. Nothing today continuously checks whether the two are still the same thing.
  That drift is usually discovered at a quarterly review — three months too late to be cheap to
  fix.

**The gap in the market is not "better charts." It's the absence of a system that closes the loop:
detect → explain → predict → recommend, continuously, before a human has to go looking for
trouble.** That loop is what Argus should productize.

---

## 2. Product Thesis (North Star)

> **Argus is being built toward becoming Halyo's Operational Intelligence layer: the system that
> continuously understands how the organization is actually executing, explains why performance
> shifts happen, predicts risk before it's visible in a dashboard, and recommends specific,
> measurable interventions.**

Two important qualifiers, deliberately stated:

- **"Being built toward"** — this is the destination, not day-one marketing copy. Positioning
  Argus as an "AI COO" before the underlying event-sourcing substrate exists is the classic
  startup trap of claiming ahead of capability, and it's the fastest way to lose credibility in a
  demo. Section 9 ties what you're _allowed to claim externally_ to what's actually shipped at
  each phase.
- **Analytics, prediction, and simulation are capabilities under this thesis, not the thesis
  itself.** Don't sell "we have Monte Carlo forecasting." Sell "we tell you a sprint is going to
  slip while there's still time to fix it" — and let the mechanism be the proof, not the pitch.

---

## 3. Why This Is a Different Agent, Not a Feature of the Others

| Agent     | Discipline                                   | Core Question It Answers                                                         |
| --------- | -------------------------------------------- | -------------------------------------------------------------------------------- |
| Odin      | Information Retrieval / RAG                  | "What do we know?"                                                               |
| Vega      | Generative Planning                          | "What should we build, and in what order?"                                       |
| Rover     | Automation / Execution                       | "Make it happen across systems."                                                 |
| **Argus** | **Statistical Inference + Causal Reasoning** | **"What's actually happening, why, what's coming next, and what should we do?"** |

Odin and Argus both "know things," but Odin's knowledge is semantic (documents, meaning,
retrieval) while Argus's is empirical (time-series, event streams, distributions). Keeping that
line sharp is what stops Argus from ever being perceived as "Odin, but with charts."

---

## 4. The Intelligence Maturity Ladder

Framed by the business outcome first, mechanism second — this is the actual value ladder a
customer experiences, not an internal engineering milestone list:

1. **Descriptive** — _"Here's what happened."_ (current-generation Argus, and every competitor)
2. **Diagnostic** — _"Here's why it happened,"_ traced to a specific, verifiable cause.
3. **Predictive** — _"Here's what's likely to happen,"_ stated as a probability, early enough to
   still act on it.
4. **Prescriptive** — _"Here's the specific action that most improves the odds,"_ with the
   expected impact quantified before you commit to it.

Rungs 2–4 are the entire market gap described in Section 1. Almost nothing in this category ships
past rung 1 today.

---

## 5. Core Architectural Pillars

Each pillar below leads with the business outcome, then the mechanism that delivers it.

### 5.1 Continuous Early-Warning (Event-Sourced Substrate)

**Outcome:** Risk is visible while there's still time to change the outcome, not after.

**Mechanism:** Stop querying current DB state; read from an append-only event log of every issue
state transition (`created`, `status_changed`, `assigned`, `blocked`, `reopened`, etc.). This is
the substrate every capability below depends on — without transition history, none of the
following is possible.

```
issue_events(
  event_id, issue_id, workspace_id, project_id,
  event_type, from_value, to_value,
  actor_id, timestamp
)
```

### 5.2 Discovering the Real Workflow (Process Mining)

**Outcome:** Surfaces bottlenecks and rework loops nobody explicitly asked about — the kind of
insight a good EM would eventually notice, produced automatically and consistently.

**Mechanism:** Teams have a declared workflow and a very different as-executed one, full of loops
and blocks. Use process mining (`pm4py` — Alpha/Heuristic/Inductive Miner) to reconstruct the real
process graph from `issue_events` and diff it against the declared cycle workflow. No LLM, no
training — this is a solved, library-supported problem.

### 5.3 Explaining Why (Causal / Diagnostic Layer)

**Outcome:** "Velocity dropped" becomes "velocity dropped _because_ review latency doubled after
two reviewers got reassigned" — an explanation a lead can actually act on, not just observe.

**Mechanism:** Test for lead-lag relationships between internal metrics (Granger causality,
lagged cross-correlation) so recurring patterns — "review latency spikes precede velocity drops
by 3–5 days for this team" — become known, reusable leading indicators. Changepoint detection
(`ruptures`, or a simple CUSUM/EWMA control chart) pinpoints exactly when a metric's regime shifted
instead of eyeballing a noisy line.

### 5.4 Forecasting, Not Extrapolating (Predictive Layer)

**Outcome:** "There's a 68% chance this sprint misses scope by more than 15%" — a probability,
stated early, instead of a linear-extrapolation guess that's usually wrong in both directions.

**Mechanism:** Monte Carlo forecasting over the team's own historical throughput distribution
(the same technique tools like Actionable Agile use) — resample 1,000–10,000 times to produce a
distribution over completion dates. No model training required, cheap to run on a schedule, and
more honest than a straight-line burndown projection.

### 5.5 Recommending, Not Just Flagging (Prescriptive Layer)

**Outcome:** Not "this is at risk" but "reassigning issue #482 raises on-time probability from
32% → 71%" — a decision, with the cost of inaction and the payoff of action both quantified.

**Mechanism:** Counterfactual re-simulation — re-run the Monte Carlo forecast under a hypothetical
intervention (reassign, defer, split) and report the shift in outcome probability. The LLM narrates
which option had the best expected impact; it never invents the number behind it.

### 5.6 Strategy-Execution Alignment (New)

**Outcome:** Leadership finds out _this week_ that engineering effort has drifted from a stated
company goal — not three months later at a QBR. This directly answers the CEO-level question
"is the roadmap actually delivering the strategy?"

**Mechanism:** If Halyo has (or builds) a first-class Goal/OKR object linked to Modules/Epics,
Argus can compute a rolling **goal-alignment score** — the share of completed work traceable to an
active company goal — and flag drift when that share declines or effort concentrates on a
deprioritized goal.

**Dependency flag:** this pillar is blocked on a product decision, not an engineering one — does
Halyo have (or plan) a structured Goals/OKR data model? If not, this stays a Phase-4+ item pending
that decision (see Open Questions, §11).

### 5.7 Organizational Signals — Scoped and Privacy-Safe (New)

**Outcome:** Surfaces structural organizational risk — knowledge concentrated in one person,
decisions stalling in review, ownership gaps — the kind of risk that normally only surfaces when
someone quits or goes on leave.

**Mechanism, deliberately conservative:** compute these only as **aggregate, team-level, or
codebase/domain-level** signals, never as individual behavior profiling:

- **Ownership concentration ("bus factor")** — derived from commit/issue-assignment history per
  module: how many people can safely touch this domain.
- **Review/decision latency** — aggregate turnaround time on reviews or approvals per team, not
  per person.
- **Knowledge distribution** — breadth of contributors across a codebase area over time.

**Explicitly out of scope, on purpose:** individual productivity scoring, per-person communication
monitoring, or anything inferable as employee surveillance. Beyond being an ethical problem, it's
a concrete sales blocker — any org evaluating Halyo, especially in the EU, will ask directly
whether this profiles individual employees, and "yes" ends the sale. Aggregate-only, transparent
to the org (not covert), config'able per workspace.

### 5.8 Cross-Agent Signal Fusion

**Outcome:** One coherent model of organizational health instead of four agents each seeing a
different slice of it.

**Mechanism:** Consume Vega's plan-revision history (plan volatility as a leading indicator),
Rover's execution telemetry (CI failure rate, PR turnaround), and Odin's semantic retrieval over
retro/postmortem docs — matched against current risk patterns via pgvector nearest-neighbor
("this looks like Sprint 14's rework loop"), turning org history into queryable memory instead of
institutional folklore.

### 5.9 Uncertainty-Aware Narration & Always-On Sentinel Loop

**Outcome:** Alerts arrive _before_ anyone asks for a report, and every claim carries an honest
confidence level instead of a bare assertion.

**Mechanism:** Argus runs as a standing, event-subscribed process (not a reactive, prompt-invoked
agent like the other three), recomputing signals on a schedule and pushing alerts through Rover
into Slack the moment a threshold is crossed. The LLM layer only narrates precomputed numbers,
always with a confidence qualifier — it never computes a metric itself.

---

## 6. Proposed Tech Stack (fits your existing free-tier pattern)

Reuses the same pattern already proven on the Model Regression Detection project — no new class
of infra needed:

| Layer                           | Tool                                                  | Notes                                                       |
| ------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| Event substrate                 | Neon Postgres                                         | Append-only `issue_events`; materialized views for rollups  |
| Process mining                  | `pm4py`                                               | Scheduled batch job                                         |
| Changepoint / anomaly detection | `ruptures`, or hand-rolled EWMA/CUSUM                 | No GPU, no training                                         |
| Forecasting                     | Monte Carlo resampling (`numpy`)                      | Cheap, statistically honest                                 |
| Causal / lead-lag               | `statsmodels` (Granger causality), lagged correlation | Interpretable over black-box ML                             |
| Semantic pattern memory         | pgvector (already provisioned)                        | Retro/postmortem embeddings, nearest-neighbor risk matching |
| Orchestration                   | GitHub Actions cron (reuse existing pattern)          | Scheduled recompute, push alerts on threshold breach        |
| Narrative layer                 | Groq / Gemini free tier                               | Narration only, never computation                           |

---

## 7. Phased Roadmap — Tied to What You're Allowed to Claim

Positioning should never outrun shipped capability. Each phase states the external claim it
unlocks, not just the engineering milestone:

| Phase | Ships                                                                             | External Claim Unlocked                                                                                                                                     |
| ----- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | `issue_events` substrate + per-team control-chart baseline                        | "We measure your team against its own history, not a generic threshold."                                                                                    |
| 1     | Process mining digest (`pm4py`)                                                   | "We show you the workflow you're actually running, not the one you designed."                                                                               |
| 2     | Monte Carlo completion forecasting                                                | "We tell you a sprint is at risk while there's still time to fix it."                                                                                       |
| 3     | Lead-lag / changepoint diagnostics                                                | "We tell you _why_, traced to a specific, reproducible cause."                                                                                              |
| 4     | Prescriptive re-simulation + goal-alignment score (contingent on §5.6 dependency) | "We tell you the specific action that improves your odds, and by how much."                                                                                 |
| 5     | Cross-agent fusion + org signals (§5.7, §5.8) + sentinel loop                     | "Argus understands organizational health, not just sprint health." — _this is the earliest point the north-star framing in §2 is an honest external claim._ |

Build and ship 0–2 first — cheapest, and already a visibly different category from a burndown
chart in a demo.

---

## 8. Evaluation — How Do You Know Argus Is Actually Working?

- **Precision/recall of at-risk predictions** against real sprint outcomes.
- **Lead time** — how many days before the deadline was risk correctly flagged?
- **Intervention accuracy** — when Argus recommended an action, did the outcome move the
  predicted direction?
- **Reproducibility** — can any alert be re-derived deterministically from the event log? If not,
  trust erodes fast, and that trust is the entire product.

---

## 9. Open Questions / Risks

1. **Does Halyo's core platform emit granular state-transition events today?** Everything above
   depends on this. If not, it's the first ticket, before any "intelligence" work starts.
2. **Does — or will — Halyo have a first-class Goals/OKR object linked to Modules/Epics?** This is
   a product decision that blocks §5.6, not an engineering one; needs a call from CEO/CTO.
3. **Pulse:** should the earlier-planned organizational-health agent be folded fully into Argus's
   fusion layer (§5.7–5.8), or kept separate? Both would need the same event substrate — merging
   avoids building it twice, but it's worth deciding deliberately rather than by default.
4. **Privacy/positioning review before §5.7 ships:** aggregate-only design is the plan, but this
   pillar should get an explicit sign-off (ideally with a one-line explanation ready for
   prospective customers) before any collaboration/ownership signal reaches production — this is
   the single easiest pillar in this document to build wrong.
5. **Cold start:** how much historical event data is needed per team before Monte Carlo forecasts
   and lead-lag detection are statistically meaningful for a brand-new workspace?
