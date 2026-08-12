import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import WhaleCopilot from "./WhaleCopilot.jsx";
import WhaleRadarModal from "./WhaleRadarModal.jsx";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cyber-bg text-white relative">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenWhaleRadar={() => setIsRadarOpen(true)}
      />

      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenWhaleRadar={() => setIsRadarOpen(true)}
      />

      <main className="pl-0 md:pl-64 pt-16 sm:pt-20 transition-all duration-300 min-h-screen safe-pb">
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      <WhaleCopilot />
      <WhaleRadarModal isOpen={isRadarOpen} onClose={() => setIsRadarOpen(false)} />
    </div>
  );
}

