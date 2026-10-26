'use client';

import { ProjectPlannerForm } from '../../components/forms/project-planner-form';

export default function CommandCenterPage() {
  return (
    <>
      <header className="page-header">
        <h1>Let's Scope This Properly.</h1>
        <p>Four short steps, and our Discovery team calls you prepared, not to pitch you.</p>
      </header>
      <ProjectPlannerForm />
    </>
  );
}
