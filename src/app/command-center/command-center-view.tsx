'use client';

import { ProjectPlannerForm } from '../../components/forms/project-planner-form';

export default function CommandCenterPage() {
  return (
    <>
      <header className="mx-auto max-w-[760px] px-[5vw] pb-12 pt-36 text-center max-[640px]:px-5 max-[640px]:pb-6 max-[640px]:pt-[calc(var(--nav-h)+2.25rem)]">
        <h1 className="my-[1.2rem] text-[clamp(2.4rem,4.6vw,3.6rem)] max-[640px]:my-4 max-[640px]:text-[clamp(2.1rem,9.5vw,2.6rem)]">Let's Scope This Properly.</h1>
        <p className="text-[1.02rem] leading-[1.6] text-[#454E4A] max-[640px]:text-base">Four short steps, and our Discovery team calls you prepared, not to pitch you.</p>
      </header>
      <ProjectPlannerForm />
    </>
  );
}
