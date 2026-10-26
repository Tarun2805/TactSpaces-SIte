import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  DEFAULT_PROJECT_BUDGET, MAX_PROJECT_BUDGET, MIN_PROJECT_BUDGET, PLANNER_STEPS,
  PROJECT_BUDGET_STEP, PROJECT_SCOPES, PROJECT_TIMELINES, PROJECT_TYPOLOGIES,
} from '../../constants/project-planner';
import { MOBILE_PLANNER_QUERY } from '../../constants/site-navigation';
import { PROJECT_LEAD_FIELD_IDS, PROJECT_LEAD_LIMITS, PROJECT_LEAD_UNAVAILABLE } from '../../constants/project-lead';
import { getProjectLeadEndpoint, submitProjectLead } from '../../fetchers/project-lead';
import { validateProjectLead } from '../../lib/validations/project-lead';
import type { ProjectLeadDetails, ProjectLeadErrors } from '../../types/project-lead';

interface PlannerFieldErrorProps {
  field: keyof ProjectLeadDetails;
  errors: ProjectLeadErrors;
}

function PlannerFieldError({ field, errors }: PlannerFieldErrorProps) {
  return errors[field] ? <span id={`${PROJECT_LEAD_FIELD_IDS[field]}Error`} className="block mt-2 text-sm font-semibold">{errors[field]}</span> : null;
}

export function ProjectPlannerForm() {
  const [step, setStep] = useState(1);
  const [typology, setTypology] = useState<string | null>(null);
  const [scope, setScope] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [budget, setBudget] = useState(DEFAULT_PROJECT_BUDGET);
  const [typologyOther, setTypologyOther] = useState('');
  const [contact, setContact] = useState({ name: '', phone: '', email: '', location: '' });
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<ProjectLeadErrors>({});
  const [submissionError, setSubmissionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const plannerRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const previousStepRef = useRef(step);
  const startedAtRef = useRef(Date.now());
  const requestRef = useRef<{ fingerprint: string; id: string } | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const isConfigured = Boolean(getProjectLeadEndpoint());

  useEffect(() => () => controllerRef.current?.abort(), []);

  useEffect(() => {
    if ((step !== previousStepRef.current || isSubmitted) && window.matchMedia(MOBILE_PLANNER_QUERY).matches) {
      (isSubmitted ? successRef : plannerRef).current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    previousStepRef.current = step;
  }, [step, isSubmitted]);

  const panelClass = (panel: number) => `step-panel${step === panel ? ' active' : ''}`;
  const details: ProjectLeadDetails = {
    ...contact, typology: typology ?? '', typologyOther: typology === 'Other' ? typologyOther : '',
    scope: scope ?? '', timeline: timeline ?? '', budget,
  };
  const fieldAccessibility = (field: keyof ProjectLeadDetails) => ({
    'aria-invalid': errors[field] ? true as const : undefined,
    'aria-describedby': errors[field] ? `${PROJECT_LEAD_FIELD_IDS[field]}Error` : undefined,
  });
  const continueFromTypology = () => {
    const nextErrors = validateProjectLead(details);
    if (nextErrors.typologyOther) {
      setErrors({ typologyOther: nextErrors.typologyOther });
      document.getElementById('typologyOther')?.focus();
    } else {
      setErrors({});
      setStep(2);
    }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step !== 4 || controllerRef.current) return;
    const nextErrors = validateProjectLead(details);
    setErrors(nextErrors);
    setSubmissionError('');
    const firstInvalid = (Object.keys(PROJECT_LEAD_FIELD_IDS) as (keyof ProjectLeadDetails)[]).find((field) => nextErrors[field]);
    if (firstInvalid) {
      setStep(nextErrors.typology || nextErrors.typologyOther ? 1 : nextErrors.scope ? 2 : nextErrors.timeline || nextErrors.budget ? 3 : 4);
      // Wait for the requested panel to become visible before moving focus.
      requestAnimationFrame(() => document.getElementById(PROJECT_LEAD_FIELD_IDS[firstInvalid])?.focus());
      return;
    }
    if (!isConfigured) {
      setSubmissionError(PROJECT_LEAD_UNAVAILABLE);
      return;
    }
    const normalized = {
      ...details, name: contact.name.trim(), phone: contact.phone.trim(), email: contact.email.trim(),
      location: contact.location.trim(), typologyOther: details.typologyOther.trim(),
    };
    // Keep the same ID on a retry after an uncertain response. Editing any field
    // creates a new enquiry, so a stale confirmation cannot accept edited data.
    const fingerprint = JSON.stringify({ ...normalized, website });
    if (requestRef.current?.fingerprint !== fingerprint) requestRef.current = { fingerprint, id: crypto.randomUUID() };
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsSubmitting(true);
    try {
      await submitProjectLead({ ...normalized, requestId: requestRef.current.id, startedAt: startedAtRef.current, website }, controller.signal);
      if (controller.signal.aborted) return;
      setIsSubmitted(true);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (error) {
      if (!controller.signal.aborted) setSubmissionError(error instanceof Error ? error.message : PROJECT_LEAD_UNAVAILABLE);
    } finally {
      if (!controller.signal.aborted) setIsSubmitting(false);
      controllerRef.current = null;
    }
  };

  return (
    <div className="planner-wrap">
      <form ref={plannerRef} className="planner" style={{ display: isSubmitted ? 'none' : undefined }} onSubmit={submit} noValidate aria-label="Project enquiry" aria-busy={isSubmitting}>
        <fieldset disabled={isSubmitting} className="border-0 p-0 m-0 min-w-0">
        <legend className="sr-only">Project details and contact information</legend>
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
            <input type="text" id="typologyOther" name="typologyOther" placeholder="e.g. clinic, warehouse, co-working space"
              value={typologyOther} onChange={(event) => setTypologyOther(event.target.value)} maxLength={PROJECT_LEAD_LIMITS.typologyOther}
              required={typology === 'Other'} {...fieldAccessibility('typologyOther')} />
            <PlannerFieldError field="typologyOther" errors={errors} />
          </div>
          <div className="planner-nav"><span /><button type="button" className="btn" id="next1" disabled={!typology} onClick={continueFromTypology}>Continue →</button></div>
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
          <div className="field"><label htmlFor="fName">Full Name</label><input type="text" id="fName" name="name" autoComplete="name" placeholder="Your name"
            required maxLength={PROJECT_LEAD_LIMITS.name} value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} {...fieldAccessibility('name')} />
            <PlannerFieldError field="name" errors={errors} /></div>
          <div className="field"><label htmlFor="fPhone">Phone</label><input type="tel" id="fPhone" name="phone" autoComplete="tel" placeholder="+91"
            required maxLength={PROJECT_LEAD_LIMITS.phone} value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} {...fieldAccessibility('phone')} />
            <PlannerFieldError field="phone" errors={errors} /></div>
          <div className="field"><label htmlFor="fEmail">Email</label><input type="email" id="fEmail" name="email" autoComplete="email" placeholder="you@email.com"
            required maxLength={PROJECT_LEAD_LIMITS.email} value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} {...fieldAccessibility('email')} />
            <PlannerFieldError field="email" errors={errors} /></div>
          <div className="field"><label htmlFor="fLoc">Project Location (Area, City)</label><input type="text" id="fLoc" name="location" placeholder="e.g. Indiranagar, Bengaluru"
            required maxLength={PROJECT_LEAD_LIMITS.location} value={contact.location} onChange={(event) => setContact({ ...contact, location: event.target.value })} {...fieldAccessibility('location')} />
            <PlannerFieldError field="location" errors={errors} /></div>
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="leadWebsite">Leave this field empty</label>
            <input type="text" id="leadWebsite" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
          </div>
          <div className="text-sm leading-relaxed">All fields are required. We’ll use your details to respond to this project enquiry.</div>
          {submissionError || !isConfigured ? <div role="alert" className="mt-4 text-sm font-semibold leading-relaxed">{submissionError || PROJECT_LEAD_UNAVAILABLE}</div> : null}
          {isSubmitting ? <div role="status" className="mt-4 text-sm">Saving your enquiry…</div> : null}
          <div className="planner-nav">
            <button type="button" className="btn ghost-btn" data-back="3" onClick={() => setStep(3)}>← Back</button>
            <button type="submit" className="btn" id="submitBtn" disabled={isSubmitting || !isConfigured}>{isSubmitting ? 'Submitting…' : 'Submit to Discovery Team →'}</button>
          </div>
        </div>
        </fieldset>
      </form>

      <div ref={successRef} className={`success-panel${isSubmitted ? ' show' : ''}`} id="successPanel" role="status" tabIndex={-1} hidden={!isSubmitted}>
        <div className="success-icon">✓</div>
        <h2>Received.</h2>
        <p>Our Discovery phase begins now. Expect a call within 24 hours to schedule your site walkthrough. In the meantime, take a look at <a href="/standard" className="underline">how we run every project</a>.</p>
      </div>
    </div>
  );
}
