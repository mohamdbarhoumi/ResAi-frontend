export const dynamic = "force-dynamic"; // ❗ disables prerendering
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import ResumeBuilderPage from "./BuilderPage"; // new file (client)

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeBuilderPage />
    </Suspense>
  );
}
