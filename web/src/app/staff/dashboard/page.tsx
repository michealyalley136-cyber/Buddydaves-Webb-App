import { Suspense } from "react";
import { StaffDashboardPage } from "./staff-dashboard-page";

export default function StaffDashboardRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121518]" />}>
      <StaffDashboardPage />
    </Suspense>
  );
}
