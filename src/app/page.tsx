import MainNavbar from "@/components/Navbar";
import { NavbarButton } from "@/components/ui/resizable-navbar";

export default function NavbarDemo() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Features",
      link: "#features",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">

      <MainNavbar navItems={navItems} />

      <div className="flex min-h-screen items-center justify-center px-4 pt-20">
        <div className="text-center">
          <h1 className="mb-6 text-6xl font-bold text-white">
            Welcome to Our Platform
          </h1>
          <p className="mb-8 text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the power of our innovative solution.
            Transform your workflow and achieve more.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <NavbarButton variant="primary" href="#demo">
              Get Started
            </NavbarButton>
            <NavbarButton variant="secondary" href="#learn">
              Learn More
            </NavbarButton>
          </div>
        </div>
      </div>

      <div className="relative h-screen bg-gradient-to-b from-transparent to-blue-900/20 flex items-center justify-center">

        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Features Section</h2>
        </div>
      </div>
    </div>
  );
}