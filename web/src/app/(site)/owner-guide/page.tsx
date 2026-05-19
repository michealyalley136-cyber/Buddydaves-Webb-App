import type { Metadata } from "next";
import { OwnerTrainingGuide } from "@/components/owner-training/owner-training-guide";

export const metadata: Metadata = {
  title: "Owner Training Guide",
  description:
    "In-app training guide for Buddy Dave's digital ordering, kitchen alerts, and go-live checklist.",
  robots: { index: false, follow: false },
};

export default function OwnerGuidePage() {
  return <OwnerTrainingGuide />;
}
