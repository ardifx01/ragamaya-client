"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { LoginModal } from "@/components/LoginModal";

interface NavItem {
  name: string;
  link: string;
}

interface MainNavbarProps {
  navItems?: NavItem[];
}

export default function MainNavbar({ navItems = [] }: MainNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const defaultNavItems = [
    { name: "Tentang", link: "#" },
    { name: "Pengenalan AI", link: "#" },
    { name: "Edukasi", link: "#" },
    { name: "Marketplace", link: "#" },
  ];

  const menuItems = navItems.length > 0 ? navItems : defaultNavItems;

  const handleLogin = () => {
    console.log("Login dengan Google...");
    setIsLoginOpen(false);
  };

  return (
    <>
      <div className="sticky inset-x-0 top-10 z-40 w-full">
        <Navbar>
          <NavBody>
            <NavbarLogo />
            <NavItems items={menuItems} />
            <div className="flex items-center gap-4">
              <NavbarButton
                variant="secondary"
                onClick={() => setIsLoginOpen(true)}
              >
                Sign In
              </NavbarButton>
            </div>
          </NavBody>
        </Navbar>

        <div
          className="relative z-50 mx-auto flex w-[95%] max-w-[calc(100vw-2rem)] flex-col items-center justify-between border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-xl lg:hidden rounded-2xl"
          style={{
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex w-full flex-row items-center justify-between">
            <NavbarLogo />
            <button
              onClick={toggleMobileMenu}
              className="flex h-8 w-8 items-center justify-center rounded-md text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {menuItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-gray-300 hover:text-white transition-colors duration-200 py-2"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-3 pt-4 border-t border-gray-700">
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLoginOpen(true);
                }}
                variant="secondary"
                className="w-full"
              >
                Sign In
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </div>
      </div>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        handleLogin={handleLogin}
      />
    </>
  );
}
