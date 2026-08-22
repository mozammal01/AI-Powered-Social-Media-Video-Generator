import { Suspense } from "react";
import type { Metadata } from "next";
import { CreateVideoEditor } from "@/components/editor/CreateVideoEditor";

export const metadata: Metadata = {
  title: "Create Video | VividAI",
  description:
    "Pick a Remotion video template, configure brand and product content, and preview the result in real time.",
};

export default function CreateVideoPage() {
  return (
    <Suspense fallback={null}>
      <CreateVideoEditor />
    </Suspense>
  );
}