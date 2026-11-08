"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Download,
  Copy,
  Check,
  Play,
  MoveRight,
  FileText,
  Code2,
  Menu,
  X,
} from "lucide-react";
import results from "./results.json";
import { asset, SITE_URL, REPO_URL } from "@/lib/site";
const PAPER = results.paperUrl;
const SITE = SITE_URL;
const citation = `@inproceedings{kim2026worldmodelvalue,
  title = {World-Model Value Depends on the Policy That Acts},
  author = {Kim, Chankyo and Wei, Yana and McAllister, Rowan Thomas and Ghaffari, Maani},
  booktitle = {CoRL Workshop on Do Robots Need World Models?},
  year = {2026},
  url = {https://openreview.net/forum?id=iEFLlkP566}
}`;
const labels: Record<string, string> = {
  WM: "World-model features",
  Direct: "Current features",
  Random: "Random choice",
};
const colors: Record<string, string> = {
  WM: "#176985",
  Direct: "#b86a38",
  Random: "#697a74",
};
function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <p className="section-label">
      <span>{number}</span>
      {children}
    </p>
  );
}
function CurveChart({ study }: { study: "fixed" | "natural" }) {
  const w = 860,
    h = 330,
    l = 60,
    r = 28,
    t = 28,
    b = 52;
  const xs = (i: number) => l + (i * (w - l - r)) / 5,
    ys = (v: number) => t + ((30 - v) / 44) * (h - t - b);
  return (
    <svg
      className="curve-chart"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-labelledby={`chart-title-${study} chart-desc-${study}`}
    >
      <title
        id={`chart-title-${study}`}
      >{`${study === "fixed" ? "Fixed-advice" : "Repeated-selection"} intervention gain across six policies`}</title>
      <desc id={`chart-desc-${study}`}>
        Six behavior-cloning checkpoints, with world-model, current-feature and
        random-choice curves. Error bars are descriptive paired 95 percent
        intervals. Values are available in the downloadable data table.
      </desc>
      {[-10, 0, 10, 20, 30].map((v) => (
        <g key={v}>
          <line
            x1={l}
            x2={w - r}
            y1={ys(v)}
            y2={ys(v)}
            stroke={v === 0 ? "#a7b1ae" : "#d6ded3"}
            strokeDasharray={v === 0 ? "0" : "3 5"}
          />
          <text
            x={l - 14}
            y={ys(v) + 5}
            textAnchor="end"
            className="chart-tick"
          >
            {v}
          </text>
        </g>
      ))}
      {results.checkpoints.map((v, i) => (
        <text
          key={v}
          x={xs(i)}
          y={h - 22}
          textAnchor="middle"
          className="chart-tick"
        >
          {v.toLocaleString("en-US")}
        </text>
      ))}
      {["Random", "Direct", "WM"].map((arm) => {
        const rows = results.curves.filter(
          (v) => v.study === study && v.arm === arm,
        );
        return (
          <g key={arm} stroke={colors[arm]} fill={colors[arm]}>
            <path
              d={rows
                .map((v, i) => `${i === 0 ? "M" : "L"}${xs(i)},${ys(v.gain)}`)
                .join(" ")}
              fill="none"
              strokeWidth={arm === "WM" ? 3 : 2}
              strokeDasharray={arm === "WM" ? undefined : arm === "Direct" ? "8 4" : "3 5"}
            />
            {rows.map((v, i) => (
              <g key={v.update}>
                <title>{`${labels[arm]}, BC${v.update}: ${v.gain.toFixed(2)} mm; 95% interval [${v.low.toFixed(2)}, ${v.high.toFixed(2)}]`}</title>
                <line
                  x1={xs(i)}
                  x2={xs(i)}
                  y1={ys(v.low)}
                  y2={ys(v.high)}
                  opacity=".65"
                />
                <line
                  x1={xs(i) - 4}
                  x2={xs(i) + 4}
                  y1={ys(v.low)}
                  y2={ys(v.low)}
                />
                <line
                  x1={xs(i) - 4}
                  x2={xs(i) + 4}
                  y1={ys(v.high)}
                  y2={ys(v.high)}
                />
                {arm === "WM" ? <circle cx={xs(i)} cy={ys(v.gain)} r={5} /> : arm === "Direct" ? <rect x={xs(i)-4} y={ys(v.gain)-4} width={8} height={8} /> : <path d={`M${xs(i)},${ys(v.gain)-5} l5,9 h-10 Z`} />}
              </g>
            ))}
          </g>
        );
      })}
      <text
        x="15"
        y="155"
        transform="rotate(-90 15 155)"
        textAnchor="middle"
        className="chart-label"
      >
        Advice gain (mm) ↑
      </text>
      <text x={w / 2} y={h - 1} textAnchor="middle" className="chart-label">
        BC checkpoint · training updates
      </text>
    </svg>
  );
}
export default function ProjectPage() {
  const [policy, setPolicy] = useState<100 | 300>(300),
    [study, setStudy] = useState<"fixed" | "natural">("fixed"),
    [replay, setReplay] = useState<"rising" | "falling">("rising"),
    [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false),
    [menuOpen, setMenuOpen] = useState(false);
  const curve = results.curves.find(
    (v) => v.study === "fixed" && v.arm === "WM" && v.update === policy,
  )!;
  const baseline = results.fixed.baseline[String(policy) as "100" | "300"],
    advice = baseline - curve.gain;
  async function copyCitation() {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="World-model value home">
          <span className="brand-symbol">
            w<span>·</span>π
          </span>
          <span>
            WORLD MODEL
            <br />
            POLICY VALUE
          </span>
        </a>
        <nav
          aria-label="Main navigation"
          className={menuOpen ? "nav-links open" : "nav-links"}
        >
          <a href="#idea" onClick={() => setMenuOpen(false)}>
            The idea
          </a>
          <a href="#evidence" onClick={() => setMenuOpen(false)}>
            Evidence
          </a>
          <a href="#replays" onClick={() => setMenuOpen(false)}>
            Robot replays
          </a>
          <a href="#resources" onClick={() => setMenuOpen(false)}>
            Resources
          </a>
        </nav>
        <a className="nav-paper" href={PAPER} target="_blank" rel="noreferrer">
          Read the paper <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      <main id="main">
        <section className="hero container">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="tiny-square" />
              CoRL 2026 · Workshop position paper
            </p>
            <h1>
              Same forecast.
              <br />
              <em>Different value.</em>
            </h1>
            <p className="paper-title">
              World-Model Value Depends
              <br className="desktop-break" /> on the Policy That Acts
            </p>
            <p className="hero-description">
              A robot policy with better baseline performance can gain
              <strong> more</strong> from identical world-model advice.
              Evaluate predictions together with the policy that acts on them.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#evidence">
                Explore the evidence <ArrowRight size={18} />
              </a>
              <a className="text-link" href={PAPER} target="_blank" rel="noreferrer">
                <FileText size={16} /> Paper
              </a>
              <a className="text-link" href={REPO_URL} target="_blank" rel="noreferrer">
                <Code2 size={16} /> GitHub
              </a>
              <a className="text-link" href="#replays">
                <Play size={15} fill="currentColor" /> Watch the robot replays
              </a>
            </div>
          </div>
          <figure className="hero-visual">
            <div className="visual-topline">
              <span>
                <i /> SIMULATED PUSHING
              </span>
              <span>01 / TASK</span>
            </div>
            <div className="robot-scene">
              <img
                src={asset("/media/task.webp")}
                width="400"
                height="400"
                alt="A red robot arm above a red object and a green goal marker in a simulated pushing task."
                fetchPriority="high"
              />
              <span className="scene-note">
                One task.
                <br />
                Different policies.
              </span>
            </div>
            <figcaption>
              <span>Push the red object to the green goal.</span>
              <span>
                Actual simulator frame <ArrowUpRight size={13} />
              </span>
            </figcaption>
            <div className="scene-flow">
              <span>Same advice</span>
              <MoveRight size={22} />
              <span>Acting policy</span>
              <MoveRight size={22} />
              <strong>Final outcome</strong>
            </div>
          </figure>
        </section>
        <section
          className="authors container"
          aria-label="Authors and affiliations"
        >
          <div className="author-names">
            Chankyo Kim<sup>1</sup>
            <span>
              Yana Wei<sup>2</sup>
            </span>
            <span>
              Rowan Thomas McAllister<sup>3</sup>
            </span>
            <span>
              Maani Ghaffari<sup>1</sup>
            </span>
          </div>
          <div className="affiliations">
            <span>
              <sup>1</sup>
              <img
                src={asset("/media/umich.png")}
                alt="University of Michigan, Ann Arbor"
                width="208"
                height="34"
              />
            </span>
            <span>
              <sup>2</sup>
              <img
                src={asset("/media/jhu.jpg")}
                alt="Johns Hopkins University"
                width="163"
                height="49"
              />
            </span>
            <span>
              <sup>3</sup>
              <img
                src={asset("/media/tri.png")}
                alt="Toyota Research Institute"
                width="143"
                height="58"
              />
            </span>
          </div>
        </section>
        <section className="idea-section section container" id="idea">
          <SectionLabel number="01">THE IDEA</SectionLabel>
          <div className="section-intro">
            <h2>
              A prediction is only as useful
              <br />
              as the actions it supports.
            </h2>
            <p>
              Our position: evaluate world models together with the policies
              that act on their predictions. A policy with better baseline
              performance can gain more from the same advice.
            </p>
          </div>
          <p className="protocol-description">
            Here, <strong>advice means five robot actions</strong> chosen using
            world-model predictions. After those actions, the tested policy
            observes the new state and controls the robot for the rest of the
            episode. BC means behavior cloning: learning to imitate expert
            actions. BC100 and BC300 are checkpoints of the same policy after
            100 and 300 training updates.
          </p>
          <div className="protocol">
            <div className="protocol-start">
              <span className="step-count">START TOGETHER</span>
              <img
                src={asset("/media/task.webp")}
                alt="Identical simulator state for both executions"
                width="96"
                height="96"
                loading="lazy"
              />
              <strong>Same robot state</strong>
            </div>
            <div className="protocol-paths">
              <div className="protocol-head">
                <span>EXECUTE FIVE COMMANDS</span>
                <span>RESUME FEEDBACK CONTROL</span>
                <span>MEASURE THE OUTCOME</span>
              </div>
              <div className="protocol-row">
                <div className="command-cell">
                  <span className="mini-tag">BASELINE</span>Common BC300
                  commands
                </div>
                <ArrowRight />
                <div className="policy-cell">Tested policy takes over</div>
                <ArrowRight />
                <div className="outcome-cell">Baseline distance</div>
              </div>
              <div className="protocol-row advice-row">
                <div className="command-cell">
                  <span className="mini-tag">WITH ADVICE</span>WM-selected
                  commands
                </div>
                <ArrowRight />
                <div className="policy-cell">Same tested policy takes over</div>
                <ArrowRight />
                <div className="outcome-cell">Distance with advice</div>
              </div>
            </div>
          </div>
          <div className="method-notes">
            <p>
              <strong>What stays fixed?</strong> Within each starting state:
              observations, forecasts, nine candidate plans, and the five
              baseline and selected commands.
            </p>
            <p>
              <strong>What changes?</strong> The policy that completes both
              executions. It observes the robot’s state and generates a new
              action sequence every five steps.
            </p>
            <p>
              <strong>What is measured?</strong> Object–goal distance, averaged
              over the last ten steps of a 100-step episode. Smaller distance is
              better. Averaging reduces sensitivity to a single final frame.
            </p>
          </div>
          <details className="method-details">
            <summary>How does the world model choose advice?</summary>
            <p>
              A frozen pretrained JEPA world model predicts future visual and
              robot-state features for nine 20-step candidate plans. A
              separately learned scorer uses these predictions to rank the
              plans. We execute the first five commands of
              the selected plan and then return control to the tested policy,
              which receives new observations. The comparison measures the
              effect of the complete subsequent execution, including feedback
              and visited states.
            </p>
          </details>
        </section>
        <section className="evidence-band" id="evidence">
          <div className="container section">
            <SectionLabel number="02">THE CENTRAL RESULT</SectionLabel>
            <div className="section-intro">
              <h2>
                Better baseline control.
                <br />
                <em>Greater value from the same advice.</em>
              </h2>
              <p>
                Across 512 matched simulator states, an improvement in baseline
                performance accompanies a larger benefit from an unchanged
                intervention.
              </p>
            </div>
            <div className="result-explorer">
              <div className="result-summary">
                <p className="small-label">
                  CHANGE IN ADVICE GAIN · BC100 → BC300
                </p>
                <div className="big-result">
                  +11.50<span> mm</span>
                </div>
                <p className="interval">Paired 95% interval [6.80, 16.25] mm</p>
                <div className="result-rule" />
                <p className="baseline-stat">
                  <strong>
                    22.43<span> mm</span>
                  </strong>{" "}
                  improvement in baseline distance
                </p>
                <p className="explain-result">
                  The stronger baseline and the larger advice gain are measured
                  separately. The headline is a <strong>change in gain</strong>,
                  not the absolute benefit of the world model.
                </p>
              </div>
              <div className="comparison-box">
                <div className="comparison-heading">
                  <h3>Change the acting policy.</h3>
                  <div
                    className="segmented"
                    role="group"
                    aria-label="Acting policy"
                  >
                    {([100, 300] as const).map((v) => (
                      <button
                        key={v}
                        aria-pressed={policy === v}
                        onClick={() => setPolicy(v)}
                      >
                        BC{v}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="comparison-subtitle">
                  The first five actions stay fixed. The policy that acts next changes.
                </p>
                <div className="distance-bars" aria-live="polite">
                  <div className="bar-label">
                    <span>Baseline distance</span>
                    <strong>
                      {baseline.toFixed(2)} <small>mm</small>
                    </strong>
                  </div>
                  <div className="bar-track">
                    <div
                      className="distance-bar baseline-bar"
                      style={{ width: `${(baseline / 170) * 100}%` }}
                    />
                  </div>
                  <div className="bar-label">
                    <span>With world-model advice</span>
                    <strong>
                      {advice.toFixed(2)} <small>mm</small>
                    </strong>
                  </div>
                  <div className="bar-track">
                    <div
                      className="distance-bar advice-bar"
                      style={{ width: `${(advice / 170) * 100}%` }}
                    />
                  </div>
                  <div
                    className={`gain-readout ${policy === 100 ? "harm" : "benefit"}`}
                  >
                    <span>
                      Advice gain
                      <br />
                      <small>Baseline − with advice</small>
                    </span>
                    <strong>
                      {curve.gain > 0 ? "+" : "−"}
                      {Math.abs(curve.gain).toFixed(2)} <small>mm</small>
                    </strong>
                  </div>
                  <p className="state-explanation">
                    {policy === 300
                      ? "With BC300, identical advice now reduces final error."
                      : "With BC100, the same advice slightly increases final error."}
                  </p>
                </div>
              </div>
            </div>
            <p className="evidence-note">
              The BC100 → BC300 comparison was fixed before fresh evaluation.
              Positive family-adjusted lower bounds support baseline
              improvement, gain increase, and gain at BC300 (15 directional
              tests; family α = .010).
            </p>
            <div className="chart-section">
              <div className="chart-heading">
                <div>
                  <p className="small-label">THE COMPLETE VIEW</p>
                  <h3>All six evaluated checkpoints.</h3>
                </div>
                <div
                  className="segmented"
                  role="group"
                  aria-label="Evaluation protocol"
                >
                  <button
                    aria-pressed={study === "fixed"}
                    onClick={() => setStudy("fixed")}
                  >
                    Fixed advice
                  </button>
                  <button
                    aria-pressed={study === "natural"}
                    onClick={() => setStudy("natural")}
                  >
                    Repeated selection
                  </button>
                </div>
              </div>
              <div className="chart-legend">
                {["WM", "Direct", "Random"].map((a) => (
                  <span key={a}>
                    <i style={{ borderTopColor: colors[a], borderTopStyle: a === "WM" ? "solid" : a === "Direct" ? "dashed" : "dotted", borderTopWidth: 2, height: 0 }} />
                    {labels[a]}
                  </span>
                ))}
              </div>
              <div
                className="chart-scroll"
                role="region"
                aria-label="Advice gain across six policies; scroll horizontally on small screens"
                tabIndex={0}
              >
                <CurveChart study={study} />
              </div>
              <p className="chart-scroll-hint">
                Scroll horizontally to see all six checkpoints.
              </p>
              <p className="chart-caption">
                {study === "fixed"
                  ? "512 shared states · One five-command intervention · Common baseline commands followed by each tested policy."
                  : "1,024 cases · Repeated selection at visited states · Baseline: each BC policy acts alone throughout."}{" "}
                Bars show descriptive paired 95% intervals.{" "}
                <a href={asset("/data/policy-value.csv")} download>
                  Download all 36 estimates ↗
                </a>
              </p>
            </div>
            <div className="control-finding">
              <span className="control-marker">A NECESSARY CONTROL</span>
              <h3>How much does forecasting add?</h3>
              <p>
                During repeated selection at BC300, world-model selection gains{" "}
                <strong>8.73 mm</strong>. Selecting actions from current
                observations, without predicting future features, gains{" "}
                <strong>18.04 mm</strong>. Both improve control; the method
                using current observations performs better in this setting.
                This comparison separates the benefit of changing actions
                from the additional value of forecasting.
              </p>
              <details>
                <summary>
                  What does the current-feature comparison control?
                </summary>
                <p>
                  The methods share a pretrained encoder, candidate construction
                  rule, network capacity, and simulated-outcome supervision.
                  Each scorer has its own validated intervention threshold.
                  Fixed-advice and repeated-selection protocols also differ in
                  scoring targets, schedules, and baselines; they are not a
                  single-factor ablation.
                </p>
              </details>
            </div>
          </div>
        </section>
        <section className="section container replays-section" id="replays">
          <SectionLabel number="03">WATCH THE CONSEQUENCES</SectionLabel>
          <div className="section-intro">
            <h2>
              Identical advice.
              <br />
              Different endings.
            </h2>
            <p>
              Actual simulator replays make policy dependence concrete. These
              exploratory examples show how benefit can change; the primary
              claim comes from the full controlled evaluation above.
            </p>
          </div>
          <div className="replay-layout">
            <div className="replay-player">
              <div className="video-header">
                <span className="record-dot" /> AUDITED SIMULATOR REPLAY{" "}
                <span>4× SLOWER PLAYBACK</span>
              </div>
              <video
                key={replay}
                controls
                playsInline
                preload="metadata"
                poster={asset(`/media/replay-${replay}.png`)}
                aria-label={
                  replay === "rising"
                    ? "Reduced-harm example: four paired robot executions"
                    : "Smaller-benefit example: four paired robot executions"
                }
              >
                <source src={asset(`/media/replay-${replay}.mp4`)} type="video/mp4" />
                Your browser does not support embedded video.{" "}
                <a href={asset(`/media/replay-${replay}.mp4`)}>Download the replay</a>.
              </video>
              <p className="video-footnote">
                Recorded simulator trajectories, not predicted images. Video
                labels show simulated time; final errors average steps 91–100.
              </p>
            </div>
            <div className="replay-story">
              <p className="small-label">CHOOSE AN EXAMPLE</p>
              <div
                className="example-selector"
                role="group"
                aria-label="Robot replay example"
              >
                <button
                  aria-pressed={replay === "rising"}
                  onClick={() => setReplay("rising")}
                >
                  <span>01</span>
                  <div>
                    <strong>Greater gain through reduced harm</strong>
                    <small>−36.3 → +2.6 mm</small>
                  </div>
                  <ArrowUpRight size={20} />
                </button>
                <button
                  aria-pressed={replay === "falling"}
                  onClick={() => setReplay("falling")}
                >
                  <span>02</span>
                  <div>
                    <strong>Smaller benefit from the same advice</strong>
                    <small>+116.0 → +71.8 mm</small>
                  </div>
                  <ArrowUpRight size={20} />
                </button>
              </div>
              <div className="example-explanation" aria-live="polite">
                <h3>
                  {replay === "rising"
                    ? "Less harm is also a larger gain."
                    : "Helpful in both cases. Not equally helpful."}
                </h3>
                <p>
                  {replay === "rising"
                    ? "The advice hurts BC100 but slightly helps BC300. Yet baseline performance worsens in this individual example. A larger advice gain does not, by itself, mean a better policy."
                    : "The same advice improves both executions, but its benefit falls from 116.0 to 71.8 mm when BC300 takes over. Policy dependence does not imply that every case improves."}
                </p>
              </div>
              <div className="replay-population">
                <p className="small-label">
                  GAIN CHANGES ACROSS 512 EXPLORATORY CASES
                </p>
                <div
                  className="population-bar"
                  role="img"
                  aria-label="252 increased, 177 decreased, 83 unchanged"
                >
                  <span style={{ width: "49.21875%" }} />
                  <span style={{ width: "34.5703125%" }} />
                  <span style={{ width: "16.2109375%" }} />
                </div>
                <div className="population-labels">
                  <span>
                    <strong>252</strong>increased
                  </span>
                  <span>
                    <strong>177</strong>decreased
                  </span>
                  <span>
                    <strong>83</strong>unchanged
                  </span>
                </div>
                <p>
                  Cases were selected after evaluation near each sign group’s
                  median gain change. Both signs are shown. The selector
                  receives the same BC300 action description in both policy
                  comparisons.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="support-section section container" id="diagnostics">
          <SectionLabel number="04">LOOK ONE LEVEL DEEPER</SectionLabel>
          <div className="section-intro">
            <h2>
              Two diagnostics.
              <br />A clearer evaluation question.
            </h2>
            <p>
              Supporting experiments ask what short-horizon plans and
              action-matched forecasts can—and cannot—tell us about final
              control performance.
            </p>
          </div>
          <div className="diagnostic-grid">
            <article className="diagnostic">
              <p className="study-tag">POST-HOC · 256 SEPARATE CASES</p>
              <h3>
                A better endpoint can lead
                <br />
                to a worse final outcome.
              </h3>
              <p>
                Select among nine plans using their{" "}
                <strong>actual simulated 20-step endpoints</strong>. Execute all
                20 actions, then resume BC1000.
              </p>
              <div className="endpoint-comparison">
                <div>
                  <span>20-step gain</span>
                  <strong>
                    +7.79<small> mm</small>
                  </strong>
                  <small>[7.15, 8.48]</small>
                </div>
                <ArrowRight />
                <div>
                  <span>Final-task gain</span>
                  <strong className="negative">
                    −3.68<small> mm</small>
                  </strong>
                  <small>[−6.15, −1.74]</small>
                </div>
              </div>
              <p className="diagnostic-takeaway">
                Evaluate what happens <em>after</em> feedback control resumes.
              </p>
              <details>
                <summary>Protocol and interpretation</summary>
                <p>
                  Reference: the unmodified plan executed for the same 20 steps.
                  Intervals are paired 95% intervals. This study uses separate
                  cases and different BC inputs from the primary evaluation.
                  Knowing the 20-step outcome is not an oracle for the final
                  task; this diagnostic does not identify the mechanism behind
                  the primary gain increase.
                </p>
              </details>
            </article>
            <article className="diagnostic">
              <p className="study-tag">EXPLORATORY · 512 REUSED STATES</p>
              <h3>
                Matching forecasts to actions
                <br />
                improves selection.
              </h3>
              <p>
                Give each candidate plan its own forecast, or replace it with
                another candidate’s forecast. Compare both with a scorer that
                uses current observations.
              </p>
              <div className="matching-bars">
                {[
                  { label: "Matched forecasts", value: 17.08 },
                  { label: "Shuffled forecasts", value: 5.48 },
                  { label: "Current features", value: 15.13 },
                ].map((v, i) => (
                  <div className={`matching-row matching-${i}`} key={v.label}>
                    <span>{v.label}</span>
                    <div>
                      <i style={{ width: `${(v.value / 20) * 100}%` }} />
                    </div>
                    <strong>{v.value.toFixed(2)}</strong>
                  </div>
                ))}
              </div>
              <p className="diagnostic-takeaway">
                Matched − shuffled: <strong>+11.60 mm</strong> [7.37, 15.90].
              </p>
              <details>
                <summary>What this establishes</summary>
                <p>
                  Values are final-task gains in mm, using five-step predicted
                  features and BC300. Separately trained scorers also receive
                  BC300’s five actions at each of eight probe states. Shuffling
                  breaks correspondence during both fitting and evaluation. The
                  matched-vs-current difference is 1.95 mm [−0.96, 4.88]:
                  superiority over current features remains unresolved.
                </p>
              </details>
            </article>
          </div>
        </section>
        <section className="takeaway">
          <div className="container">
            <p className="eyebrow">THE TAKEAWAY</p>
            <h2>
              Evaluate world models
              <br />
              <em>with the policies that act.</em>
            </h2>
            <div className="takeaway-bottom">
              <p>
                Measure baseline control, the gain from selected actions, and
                the additional gain from forecasting. Evaluate the final
                outcome after the policy resumes control.
              </p>
              <div className="scope-note">
                <strong>Evidence in context</strong>
                <p>
                  One simulated task and one BC training run; privileged policy
                  observations; physics paused during inference. At BC300,
                  candidate evaluation took 1.001 s/episode with WM versus 0.057
                  s with direct scoring. These are computation times, not
                  physical waiting losses.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="section container resources" id="resources">
          <SectionLabel number="05">READ, REUSE, DISCUSS</SectionLabel>
          <div className="section-intro">
            <h2>Take a closer look.</h2>
            <p>
              Paper, poster, numerical evidence, and the complete project-page
              source in one place.
            </p>
          </div>
          <div className="resource-list">
            <a href={asset("/downloads/paper.pdf")} target="_blank" rel="noreferrer">
              <FileText />
              <div>
                <strong>Read the paper</strong>
                <span>Camera-ready manuscript and appendix · PDF</span>
              </div>
              <ArrowUpRight />
            </a>
            <a href={asset("/downloads/poster.pdf")} target="_blank" rel="noreferrer">
              <FileText />
              <div>
                <strong>Explore the poster</strong>
                <span>
                  Full argument, experiments, and robot examples · A0 PDF
                </span>
              </div>
              <ArrowUpRight />
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              <Code2 />
              <div>
                <strong>GitHub: source & evaluation artifacts</strong>
                <span>
                  Website, illustrated README, result data, and plot
                  reproduction
                </span>
              </div>
              <Download />
            </a>
            <a href={PAPER} target="_blank" rel="noreferrer">
              <ArrowUpRight />
              <div>
                <strong>OpenReview</strong>
                <span>Workshop paper page</span>
              </div>
              <ArrowUpRight />
            </a>
          </div>
          <div className="citation">
            <div className="citation-heading">
              <h3>Cite this work</h3>
              <button onClick={copyCitation} aria-label="Copy BibTeX citation">
                {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
                {copied ? "Copied" : "Copy BibTeX"}
              </button>
            </div>
            <pre role="region" tabIndex={0} aria-label="BibTeX citation">
              <code>{citation}</code>
            </pre>
            <p className="copy-status" aria-live="polite">
              {copyError
                ? "Clipboard access is unavailable. Select and copy the citation above."
                : copied
                  ? "Citation copied to your clipboard."
                  : ""}
            </p>
          </div>
        </section>
      </main>
      <footer className="site-footer container">
        <div>
          <a className="footer-brand" href="#">
            World-model value / acting policy
          </a>
          <p>CoRL 2026 · Do Robots Need World Models? Workshop</p>
        </div>
        <div>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE)}`}
            target="_blank"
            rel="noreferrer"
          >
            Share on LinkedIn <ArrowUpRight size={14} />
          </a>
          <a href={asset("/data/results.json")} download>
            Results JSON <Download size={14} />
          </a>
        </div>
      </footer>
    </>
  );
}
