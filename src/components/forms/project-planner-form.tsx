import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_PROJECT_BUDGET, MAX_PROJECT_BUDGET, MIN_PROJECT_BUDGET, PLANNER_STEPS,
  PROJECT_BUDGET_STEP, PROJECT_SCOPES, PROJECT_TIMELINES, PROJECT_TYPOLOGIES,
} from '../../constants/project-planner';
import { MOBILE_PLANNER_QUERY } from '../../constants/site-navigation';

export function ProjectPlannerForm() {
  const [step, setStep] = useState(1);
  const [typology, setTypology] = useState<string | null>(null);
  const [scope, setScope] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [budget, setBudget] = useState(DEFAULT_PROJECT_BUDGET);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const plannerRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const previousStepRef = useRef(step);

  useEffect(() => {
    if ((step !== previousStepRef.current || isSubmitted) && window.matchMedia(MOBILE_PLANNER_QUERY).matches) {
      (isSubmitted ? successRef : plannerRef).current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    previousStepRef.current = step;
  }, [step, isSubmitted]);

  const panelClass = (panel: number) => `step-panel${step === panel ? ' active' : ''}`;

  return (
    <div className="planner-wrap">
      <div ref={plannerRef} className="planner" style={{ display: isSubmitted ? 'none' : undefined }}>
        <div className="planner-progress" aria-label={`Step ${step} of 4`}>
          {PLANNER_STEPS.map((number) => (
            <div className={`dot${number <= step ? ' done' : ''}`} data-dot={number} key={number}><div className="fill" /></div>
          ))}
        </div>

        <div className={panelClass(1)} data-panel="1" hidden={step !== 1}>
          <span className="step-label">Step 1 of 4</span>
          <h2 className="step-title">What are we building?</h2>
          <div className="tile-group" data-group="typology">
            {PROJECT_TYPOLOGIES.map((option) => (
              <button type="button" className={`tile${typology === option.value ? ' selected' : ''}`}
                key={option.value} data-value={option.value} aria-pressed={typology === option.value}
                onClick={() => setTypology(option.value)}>
                <span className="tile-icon">{option.icon}</span><span className="tile-label">{option.value}</span>
              </button>
            ))}
          </div>
          <div className="field mt-[1.2rem]" id="typologyOtherField" style={{ display: typology === 'Other' ? 'block' : 'none' }}>
            <label htmlFor="typologyOther">Tell us what you're building</label>
            <input type="text" id="typologyOther" placeholder="e.g. clinic, warehouse, co-working space" />
          </div>
          <div className="planner-nav"><span /><button type="button" className="btn" id="next1" disabled={!typology} onClick={() => setStep(2)}>Continue →</button></div>
        </div>

        <div className={panelClass(2)} data-panel="2" hidden={step !== 2}>
          <span className="step-label">Step 2 of 4</span>
          <h2 className="step-title">How far should we take it?</h2>
          <div className="toggle-group" data-group="scope">
            {PROJECT_SCOPES.map((option) => (
              <button type="button" className={`toggle-card text-left${scope === option.value ? ' selected' : ''}`}
                key={option.value} data-value={option.value} aria-pressed={scope === option.value}
                onClick={() => setScope(option.value)}>
                {option.recommended ? <span className="badge-rec">Recommended</span> : null}
                <h4>{option.value}</h4><p>{option.description}</p>
              </button>
            ))}
          </div>
          <div className="planner-nav">
            <button type="button" className="btn ghost-btn" data-back="1" onClick={() => setStep(1)}>← Back</button>
            <button type="button" className="btn" id="next2" disabled={!scope} onClick={() => setStep(3)}>Continue →</button>
          </div>
        </div>

        <div className={panelClass(3)} data-panel="3" hidden={step !== 3}>
          <span className="step-label">Step 3 of 4</span>
          <h2 className="step-title">What's the frame we're working within?</h2>
          <div className="mb-8">
            <div className="block text-[0.85rem] font-semibold mb-[0.7rem]" id="timelineLabel">Timeline</div>
            <div className="segmented" data-group="timeline" aria-labelledby="timelineLabel">
              {PROJECT_TIMELINES.map((value) => (
                <button type="button" key={value} data-value={value} className={timeline === value ? 'selected' : undefined}
                  aria-pressed={timeline === value} onClick={() => setTimeline(value)}>{value}</button>
              ))}
            </div>
          </div>
          <div className="range-field">
            <label htmlFor="budgetRange">Budget</label>
            <span className="range-value" id="budgetOut">₹{budget}L</span>
            <input type="range" id="budgetRange" min={MIN_PROJECT_BUDGET} max={MAX_PROJECT_BUDGET}
              value={budget} step={PROJECT_BUDGET_STEP} aria-valuetext={`₹${budget} lakh`}
              onChange={(event) => setBudget(Number(event.target.value))} />
          </div>
          <div className="planner-nav mt-8">
            <button type="button" className="btn ghost-btn" data-back="2" onClick={() => setStep(2)}>← Back</button>
            <button type="button" className="btn" id="next3" disabled={!timeline} onClick={() => setStep(4)}>Continue →</button>
          </div>
        </div>

        <div className={panelClass(4)} data-panel="4" hidden={step !== 4}>
          <span className="step-label">Step 4 of 4</span>
          <h2 className="step-title">A little about you.</h2>
          <div className="field"><label htmlFor="fName">Full Name</label><input type="text" id="fName" autoComplete="name" placeholder="Your name" /></div>
          <div className="field"><label htmlFor="fPhone">Phone</label><input type="tel" id="fPhone" autoComplete="tel" placeholder="+91" /></div>
          <div className="field"><label htmlFor="fEmail">Email</label><input type="email" id="fEmail" autoComplete="email" placeholder="you@email.com" /></div>
          <div className="field"><label htmlFor="fLoc">Project Location (Area, City)</label><input type="text" id="fLoc" placeholder="e.g. Indiranagar, Bengaluru" /></div>
          <div className="planner-nav">
            <button type="button" className="btn ghost-btn" data-back="3" onClick={() => setStep(3)}>← Back</button>
            {/* Preserve the original demo-only confirmation; no backend was supplied. */}
            <button type="button" className="btn" id="submitBtn" onClick={() => setIsSubmitted(true)}>Submit to Discovery Team →</button>
          </div>
        </div>
      </div>

      <div ref={successRef} className={`success-panel${isSubmitted ? ' show' : ''}`} id="successPanel" role="status" hidden={!isSubmitted}>
        <div className="success-icon">✓</div>
        <h2>Received.</h2>
        <p>Our Discovery phase begins now. Expect a call within 24 hours to schedule your site walkthrough. In the meantime, take a look at <a href="standard.html" className="underline">how we run every project</a>.</p>
      </div>
    </div>
  );
}
