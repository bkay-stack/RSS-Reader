import React from "react";
import Nav from "@/components/layout/nav/page";
import { Lock } from "lucide-react";
const ResetPassword = () => {
  return (
    <div>
      <Nav />
      <main className="min-h-screen bg-bg-secondary flex flex-col items-center  py-10  ">
        {/* Lock icon */}
        <div className="flex items-center justify-center w-30 h-30 rounded-full bg-accent mb-4">
          <Lock size={60} className="text-white" />
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
