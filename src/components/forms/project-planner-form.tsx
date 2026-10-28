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
    <div className="mx-auto max-w-[720px] px-[5vw] pb-32 max-[640px]:px-5 max-[640px]:pb-14">
      <form ref={plannerRef} className="planner scroll-mt-[calc(var(--nav-h)+12px)] border border-[#DAD7CE] bg-[#F1EFEA] p-[3.2rem] max-[600px]:px-[1.4rem] max-[600px]:py-8 max-[640px]:p-5" style={{ display: isSubmitted ? 'none' : undefined }} onSubmit={submit} noValidate aria-label="Project enquiry" aria-busy={isSubmitting}>
        <fieldset disabled={isSubmitting} className="border-0 p-0 m-0 min-w-0">
        <legend className="sr-only">Project details and contact information</legend>
        <div className="mb-12 flex gap-2 max-[640px]:mb-7" aria-label={`Step ${step} of 4`}>
          {PLANNER_STEPS.map((number) => (
            <div className={`relative h-[3px] flex-1 overflow-hidden bg-[#DAD7CE]${number <= step ? ' done' : ''}`} data-dot={number} key={number}><div className={`absolute inset-0 origin-left bg-[#1F2D28] transition-transform duration-[400ms] ease-in-out ${number <= step ? 'scale-x-100' : 'scale-x-0'}`} /></div>
          ))}
        </div>

        <div className={`${panelClass(1)} ${step === 1 ? 'block' : 'hidden'}`} data-panel="1" hidden={step !== 1}>
          <span className="step-label mb-[0.6rem] block text-[0.72rem] font-bold uppercase tracking-[0.15em] text-[#273939]">Step 1 of 4</span>
          <h2 className="mb-8 text-[1.6rem] max-[640px]:mb-5 max-[640px]:text-[1.4rem]">What are we building?</h2>
          <div className="flex flex-wrap gap-4 max-[560px]:grid max-[560px]:grid-cols-2 max-[560px]:gap-3" data-group="typology">
            {PROJECT_TYPOLOGIES.map((option) => (
              <button type="button" className={`min-w-0 flex-[1_1_140px] cursor-pointer border border-[#DAD7CE] bg-[#F9F9F7] px-5 py-[1.8rem] text-center transition-[border-color,background-color] duration-[250ms] hover:border-[#1F2D28] max-[560px]:flex-none max-[560px]:px-2 max-[560px]:py-[1.1rem] max-[560px]:min-h-[92px] max-[560px]:flex max-[560px]:flex-col max-[560px]:items-center max-[560px]:justify-center max-[560px]:[&:last-child:nth-child(odd)]:col-span-2${typology === option.value ? ' selected border-[#1F2D28] bg-[#1F2D28] text-[#F9F9F7]' : ''}`}
                key={option.value} data-value={option.value} aria-pressed={typology === option.value}
                onClick={() => setTypology(option.value)}>
                <span className="mb-[0.7rem] block text-[1.6rem] max-[640px]:mb-[0.4rem] max-[640px]:text-[1.3rem]">{option.icon}</span><span className="tile-label text-[0.95rem] font-semibold">{option.value}</span>
              </button>
            ))}
          </div>
          <div className="mb-[1.3rem] mt-[1.2rem] [&>label]:mb-2 [&>label]:block [&>label]:text-[0.8rem] [&>label]:font-semibold [&_input]:w-full [&_input]:border [&_input]:border-[#DAD7CE] [&_input]:bg-[#F9F9F7] [&_input]:px-4 [&_input]:py-[0.85rem] [&_input]:text-[0.92rem] [&_input]:text-[#22282A] [&_input]:focus:border-[#1F2D28] [&_input]:focus:outline-none" id="typologyOtherField" style={{ display: typology === 'Other' ? 'block' : 'none' }}>
            <label htmlFor="typologyOther">Tell us what you're building</label>
            <input type="text" id="typologyOther" name="typologyOther" placeholder="e.g. clinic, warehouse, co-working space"
              value={typologyOther} onChange={(event) => setTypologyOther(event.target.value)} maxLength={PROJECT_LEAD_LIMITS.typologyOther}
              required={typology === 'Other'} {...fieldAccessibility('typologyOther')} />
            <PlannerFieldError field="typologyOther" errors={errors} />
          </div>
          <div className="mt-[2.6rem] flex justify-between max-[640px]:mt-7 max-[640px]:flex-col-reverse max-[640px]:gap-3 [&>span:empty]:max-[640px]:hidden"><span /><button type="button" className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-transparent bg-[#1f2d28] px-6 py-3 text-[.875rem] leading-[1.4] font-semibold tracking-[.01em] text-[#f9f9f7] transition-[background,transform] duration-300 hover:-translate-y-px hover:bg-[#16211d] disabled:cursor-not-allowed disabled:opacity-[.35] disabled:transform-none max-[640px]:min-h-[50px] max-[640px]:w-full" id="next1" disabled={!typology} onClick={continueFromTypology}>Continue →</button></div>
        </div>

        <div className={`${panelClass(2)} ${step === 2 ? 'block' : 'hidden'}`} data-panel="2" hidden={step !== 2}>
          <span className="step-label mb-[0.6rem] block text-[0.72rem] font-bold uppercase tracking-[0.15em] text-[#273939]">Step 2 of 4</span>
          <h2 className="mb-8 text-[1.6rem] max-[640px]:mb-5 max-[640px]:text-[1.4rem]">How far should we take it?</h2>
          <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1" data-group="scope">
            {PROJECT_SCOPES.map((option) => (
              <button type="button" className={`relative cursor-pointer border border-[#DAD7CE] bg-[#F9F9F7] p-[1.8rem] text-left transition-[border-color,background-color] duration-[250ms] hover:border-[#1F2D28] max-[640px]:p-5${scope === option.value ? ' selected border-[#1F2D28] bg-[#1F2D28] text-[#F9F9F7]' : ''}`}
                key={option.value} data-value={option.value} aria-pressed={scope === option.value}
                onClick={() => setScope(option.value)}>
                {option.recommended ? <span className="absolute -top-[10px] right-5 bg-[#273939] px-[0.6rem] py-1 text-[0.65rem] font-bold uppercase tracking-[0.06em] text-[#F9F9F7]">Recommended</span> : null}
                <h4 className="mb-2 text-[1.05rem]">{option.value}</h4><p className="text-[0.85rem] leading-[1.5] opacity-[0.85]">{option.description}</p>
              </button>
            ))}
          </div>
          <div className="mt-[2.6rem] flex justify-between max-[640px]:mt-7 max-[640px]:flex-col-reverse max-[640px]:gap-3 [&>span:empty]:max-[640px]:hidden">
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-[#dad7ce] bg-transparent px-6 py-3 text-[.875rem] leading-[1.4] font-semibold tracking-[.01em] text-[#22282a] transition-colors duration-300 hover:bg-[#f1efea] max-[640px]:min-h-[50px] max-[640px]:w-full" data-back="1" onClick={() => setStep(1)}>← Back</button>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-transparent bg-[#1f2d28] px-6 py-3 text-[.875rem] leading-[1.4] font-semibold tracking-[.01em] text-[#f9f9f7] transition-[background,transform] duration-300 hover:-translate-y-px hover:bg-[#16211d] disabled:cursor-not-allowed disabled:opacity-[.35] disabled:transform-none max-[640px]:min-h-[50px] max-[640px]:w-full" id="next2" disabled={!scope} onClick={() => setStep(3)}>Continue →</button>
          </div>
        </div>

        <div className={`${panelClass(3)} ${step === 3 ? 'block' : 'hidden'}`} data-panel="3" hidden={step !== 3}>
          <span className="step-label mb-[0.6rem] block text-[0.72rem] font-bold uppercase tracking-[0.15em] text-[#273939]">Step 3 of 4</span>
          <h2 className="mb-8 text-[1.6rem] max-[640px]:mb-5 max-[640px]:text-[1.4rem]">What's the frame we're working within?</h2>
          <div className="mb-8">
            <div className="block text-[0.85rem] font-semibold mb-[0.7rem]" id="timelineLabel">Timeline</div>
            <div className="mb-[2.4rem] flex overflow-hidden border border-[#DAD7CE] max-[640px]:grid max-[640px]:grid-cols-2 max-[640px]:gap-px max-[640px]:bg-[#DAD7CE]" data-group="timeline" aria-labelledby="timelineLabel">
              {PROJECT_TIMELINES.map((value) => (
                <button type="button" key={value} data-value={value} className={`min-w-0 flex-1 border-0 border-r border-[#DAD7CE] bg-[#F9F9F7] px-2 py-[0.9rem] text-[0.82rem] font-semibold text-[#22282A] last:border-r-0 max-[640px]:min-h-[50px] max-[640px]:border-0${timeline === value ? ' selected bg-[#1F2D28] text-[#F9F9F7]' : ''}`}
                  aria-pressed={timeline === value} onClick={() => setTimeline(value)}>{value}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-[0.6rem] block text-[0.85rem] font-semibold" htmlFor="budgetRange">Budget</label>
            <span className="mb-[0.8rem] block font-[Playfair_Display,serif] text-2xl text-[#1F2D28]" id="budgetOut">₹{budget}L</span>
            <input className="h-1 w-full accent-[#1F2D28] max-[640px]:h-8" type="range" id="budgetRange" min={MIN_PROJECT_BUDGET} max={MAX_PROJECT_BUDGET}
              value={budget} step={PROJECT_BUDGET_STEP} aria-valuetext={`₹${budget} lakh`}
              onChange={(event) => setBudget(Number(event.target.value))} />
          </div>
          <div className="mt-8 flex justify-between max-[640px]:mt-7 max-[640px]:flex-col-reverse max-[640px]:gap-3 [&>span:empty]:max-[640px]:hidden">
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-[#dad7ce] bg-transparent px-6 py-3 text-[.875rem] leading-[1.4] font-semibold tracking-[.01em] text-[#22282a] transition-colors duration-300 hover:bg-[#f1efea] max-[640px]:min-h-[50px] max-[640px]:w-full" data-back="2" onClick={() => setStep(2)}>← Back</button>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-transparent bg-[#1f2d28] px-6 py-3 text-[.875rem] leading-[1.4] font-semibold tracking-[.01em] text-[#f9f9f7] transition-[background,transform] duration-300 hover:-translate-y-px hover:bg-[#16211d] disabled:cursor-not-allowed disabled:opacity-[.35] disabled:transform-none max-[640px]:min-h-[50px] max-[640px]:w-full" id="next3" disabled={!timeline} onClick={() => setStep(4)}>Continue →</button>
          </div>
        </div>

        <div className={`${panelClass(4)} ${step === 4 ? 'block' : 'hidden'}`} data-panel="4" hidden={step !== 4}>
          <span className="step-label mb-[0.6rem] block text-[0.72rem] font-bold uppercase tracking-[0.15em] text-[#273939]">Step 4 of 4</span>
          <h2 className="mb-8 text-[1.6rem] max-[640px]:mb-5 max-[640px]:text-[1.4rem]">A little about you.</h2>
          <div className="mb-[1.3rem] [&>label]:mb-2 [&>label]:block [&>label]:text-[0.8rem] [&>label]:font-semibold [&_input]:w-full [&_input]:border [&_input]:border-[#DAD7CE] [&_input]:bg-[#F9F9F7] [&_input]:px-4 [&_input]:py-[0.85rem] [&_input]:text-[0.92rem] [&_input]:text-[#22282A] [&_input]:focus:border-[#1F2D28] [&_input]:focus:outline-none max-[640px]:[&_input]:min-h-12 max-[640px]:[&_input]:px-4 max-[640px]:[&_input]:py-[0.85rem] max-[640px]:[&_input]:text-base"><label htmlFor="fName">Full Name</label><input type="text" id="fName" name="name" autoComplete="name" placeholder="Your name"
            required maxLength={PROJECT_LEAD_LIMITS.name} value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} {...fieldAccessibility('name')} />
            <PlannerFieldError field="name" errors={errors} /></div>
          <div className="mb-[1.3rem] [&>label]:mb-2 [&>label]:block [&>label]:text-[0.8rem] [&>label]:font-semibold [&_input]:w-full [&_input]:border [&_input]:border-[#DAD7CE] [&_input]:bg-[#F9F9F7] [&_input]:px-4 [&_input]:py-[0.85rem] [&_input]:text-[0.92rem] [&_input]:text-[#22282A] [&_input]:focus:border-[#1F2D28] [&_input]:focus:outline-none max-[640px]:[&_input]:min-h-12 max-[640px]:[&_input]:text-base"><label htmlFor="fPhone">Phone</label><input type="tel" id="fPhone" name="phone" autoComplete="tel" placeholder="+91"
            required maxLength={PROJECT_LEAD_LIMITS.phone} value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} {...fieldAccessibility('phone')} />
            <PlannerFieldError field="phone" errors={errors} /></div>
          <div className="mb-[1.3rem] [&>label]:mb-2 [&>label]:block [&>label]:text-[0.8rem] [&>label]:font-semibold [&_input]:w-full [&_input]:border [&_input]:border-[#DAD7CE] [&_input]:bg-[#F9F9F7] [&_input]:px-4 [&_input]:py-[0.85rem] [&_input]:text-[0.92rem] [&_input]:text-[#22282A] [&_input]:focus:border-[#1F2D28] [&_input]:focus:outline-none max-[640px]:[&_input]:min-h-12 max-[640px]:[&_input]:text-base"><label htmlFor="fEmail">Email</label><input type="email" id="fEmail" name="email" autoComplete="email" placeholder="you@email.com"
            required maxLength={PROJECT_LEAD_LIMITS.email} value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} {...fieldAccessibility('email')} />
            <PlannerFieldError field="email" errors={errors} /></div>
          <div className="mb-[1.3rem] [&>label]:mb-2 [&>label]:block [&>label]:text-[0.8rem] [&>label]:font-semibold [&_input]:w-full [&_input]:border [&_input]:border-[#DAD7CE] [&_input]:bg-[#F9F9F7] [&_input]:px-4 [&_input]:py-[0.85rem] [&_input]:text-[0.92rem] [&_input]:text-[#22282A] [&_input]:focus:border-[#1F2D28] [&_input]:focus:outline-none max-[640px]:[&_input]:min-h-12 max-[640px]:[&_input]:text-base"><label htmlFor="fLoc">Project Location (Area, City)</label><input type="text" id="fLoc" name="location" placeholder="e.g. Indiranagar, Bengaluru"
            required maxLength={PROJECT_LEAD_LIMITS.location} value={contact.location} onChange={(event) => setContact({ ...contact, location: event.target.value })} {...fieldAccessibility('location')} />
            <PlannerFieldError field="location" errors={errors} /></div>
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="leadWebsite">Leave this field empty</label>
            <input type="text" id="leadWebsite" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
          </div>
          <div className="text-sm leading-relaxed">All fields are required. We’ll use your details to respond to this project enquiry.</div>
          {submissionError || !isConfigured ? <div role="alert" className="mt-4 text-sm font-semibold leading-relaxed">{submissionError || PROJECT_LEAD_UNAVAILABLE}</div> : null}
          {isSubmitting ? <div role="status" className="mt-4 text-sm">Saving your enquiry…</div> : null}
          <div className="planner-nav mt-[2.6rem] flex justify-between max-[640px]:mt-7 max-[640px]:flex-col-reverse max-[640px]:gap-3 [&>span:empty]:max-[640px]:hidden">
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-[#dad7ce] bg-transparent px-6 py-3 text-[.875rem] leading-[1.4] font-semibold tracking-[.01em] text-[#22282a] transition-colors duration-300 hover:bg-[#f1efea] max-[640px]:min-h-[50px] max-[640px]:w-full" data-back="3" onClick={() => setStep(3)}>← Back</button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-transparent bg-[#1f2d28] px-6 py-3 text-[.875rem] leading-[1.4] font-semibold tracking-[.01em] text-[#f9f9f7] transition-[background,transform] duration-300 hover:-translate-y-px hover:bg-[#16211d] disabled:cursor-not-allowed disabled:opacity-[.35] disabled:transform-none max-[640px]:min-h-[50px] max-[640px]:w-full" id="submitBtn" disabled={isSubmitting || !isConfigured}>{isSubmitting ? 'Submitting…' : 'Submit to Discovery Team →'}</button>
          </div>
        </div>
        </fieldset>
      </form>

      <div ref={successRef} className={`scroll-mt-[calc(var(--nav-h)+12px)] bg-[#1F2D28] px-10 py-14 text-center text-[#F9F9F7] max-[640px]:px-6 max-[640px]:py-10${isSubmitted ? ' show block' : ' hidden'}`} id="successPanel" role="status" tabIndex={-1} hidden={!isSubmitted}>
        <div className="mx-auto mb-4 flex size-[52px] items-center justify-center rounded-full border-2 border-[#F9F9F7] text-[1.4rem]">✓</div>
        <h2 className="my-4 text-[1.8rem]">Received.</h2>
        <p className="mx-auto max-w-[440px] leading-[1.6] opacity-[0.85]">Our Discovery phase begins now. Expect a call within 24 hours to schedule your site walkthrough. In the meantime, take a look at <a href="/standard" className="underline">how we run every project</a>.</p>
      </div>
    </div>
  );
}
