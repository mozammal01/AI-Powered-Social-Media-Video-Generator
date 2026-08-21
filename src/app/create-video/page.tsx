import type { Metadata } from "next";
import { CreateVideoEditor } from "@/components/editor/CreateVideoEditor";

export const metadata: Metadata = {
  title: "Create Video | VividAI",
  description:
    "Configure brand and product content and preview a Remotion product advertisement in real time.",
};

export default function CreateVideoPage() {
  return <CreateVideoEditor />;
}
