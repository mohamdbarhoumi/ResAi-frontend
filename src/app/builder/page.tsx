export const dynamic = "force-dynamic"; 
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import ResumeBuilderPage from "./BuilderPage"; 

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeBuilderPage />
    </Suspense>
  );
}
