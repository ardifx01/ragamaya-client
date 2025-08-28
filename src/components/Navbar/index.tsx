"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { LoginModal } from "@/components/LoginModal";
import Link from "next/link";
import {Button, Image, useDisclosure} from "@heroui/react";
import { GetUserData, isUserLoggedIn, handleLogout as logoutUser } from "@/lib/GetUserData";
import {usePathname} from "next/navigation";
import ModalRegisterSeller from "@/components/ui/modal/ModalRegisterSeller";

interface NavItem {
  name: string;
  link: string;
}

interface MainNavbarProps {
  navItems?: NavItem[];
}

interface UserData {
  id?: string;
  name?: string;
  avatar?: string;
  email?: string;
  role?: string;
}

export default function MainNavbar({ navItems = [] }: MainNavbarProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Modal
    const modalRegisterSeller = useDisclosure();

  const Avatar = ({ src, alt, className }: { src?: string; alt: string; className: string }) => {
    const [imgSrc, setImgSrc] = useState(src || "https://ui-avatars.com/api/?name=" + encodeURIComponent(alt) + "&background=random");

    const handleError = () => {
      console.log("Avatar error, falling back to UI Avatars");
      setImgSrc("https://ui-avatars.com/api/?name=" + encodeURIComponent(alt) + "&background=6366f1&color=fff");
    };

    return (
      <Image
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        referrerPolicy="no-referrer"
      />
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const defaultNavItems = [
    { name: "Tentang", link: "/" },
    { name: "Pengenalan AI", link: "/deteksi" },
    { name: "Edukasi", link: "/edukasi" },
    { name: "Marketplace", link: "/marketplace" },
    { name: "Forum", link: "/forum" },
  ];

  const menuItems = navItems.length > 0 ? navItems : defaultNavItems;

  const checkLoginStatus = () => {
    setIsLoading(true);
    try {
      const loggedIn = isUserLoggedIn();

      if (loggedIn) {
        setIsLoggedIn(true);
        const user_data = GetUserData();
        setUserData(user_data);
      } else {
        setIsLoggedIn(false);
        setUserData({});
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUserData({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = () => {
    checkLoginStatus();
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUserData({});
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <div className={`fixed inset-x-0 top-10 z-40 w-full ${isDashboard ? "hidden" : ""}`}>
        <Navbar>
          <NavBody>
            <NavbarLogo/>
            <NavItems items={menuItems}/>
            <div className="flex items-center gap-4">
              {isLoading ? (
                <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 animate-pulse"></div>
                  <div className="w-28 h-3 bg-white/20 rounded animate-pulse"></div>
                </div>
              ) : isLoggedIn && userData.id ? (
                <div className="relative dropdown-container">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <Avatar
                      src={userData.avatar}
                      alt={userData.name || "User"}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="text-sm font-medium max-w-28 truncate flex items-center">
                      {userData.name || "User"}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-black backdrop-blur-xl border border-white/20 shadow-2xl"
                      style={{
                        boxShadow:
                          "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div className="py-2">
                        <div className="px-4 py-3 space-y-1 border-b border-white/20">
                          <p className="text-sm font-semibold text-gray-300 ">
                            Selamat Datang,
                          </p>
                          <p className="text-sm text-white truncate">
                            {userData.name || userData.email || "User"}
                          </p>
                        </div>

                          {userData.role === "user" ? (
                              <Link
                                  href="#"
                                  type="button"
                                  className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                                  onClick={(e) => {
                                      e.preventDefault();
                                      toggleDropdown();
                                      modalRegisterSeller.onOpen()
                                  }}
                              >
                                  Daftar Sebagai Penjual
                              </Link>
                          ) : (
                              <Link
                                  href="/dashboard"
                                  className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                                  onClick={() => setIsDropdownOpen(false)}
                              >
                                  Dashboard
                              </Link>
                          )}

                          <Link
                          href="/pembelian"
                          className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Batik Saya
                        </Link>

                        <Link
                          href="/histori"
                          className="flex items-center px-4 py-3 mb-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Histori Pembelian
                        </Link>

                        <div className="border-t border-white/20 mt-1">
                          <NavbarButton
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              handleLogout();
                            }}
                            variant="secondary"
                            className="mx-2 mt-1 justify-center flex font-semibold text-white bg-red-600"
                          >
                            Log Out
                          </NavbarButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavbarButton
                  variant="secondary"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Sign In
                </NavbarButton>
              )}
            </div>
          </NavBody>
        </Navbar>

        {/* Mobile Navbar */}

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
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 mb-2 border-b border-gray-500">
                <div className="w-6 h-6 rounded-full bg-white/20 animate-pulse"></div>
                <div className="flex flex-col gap-1">
                  <div className="w-16 h-2 bg-white/20 rounded animate-pulse"></div>
                  <div className="w-20 h-3 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
            ) : isLoggedIn && userData.id ? (
              <div className="px-3 py-3 mb-0 w-full border-b border-gray-500">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar
                    src={userData.avatar}
                    alt={userData.name || "User"}
                    className="w-8 h-8 rounded-full object-cover border border-white/30"
                  />
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold text-gray-300">
                      Selamat Datang,
                    </p>
                    <p className="text-sm text-white font-medium truncate">
                      {userData.name || userData.email || "User"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            {menuItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-gray-300 hover:text-white transition-colors duration-200 py-2 block"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}

            {isLoggedIn && userData.id && (
              <>
                <div className="">
                  <Link
                    href="/pembelian"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 py-2 block text-md"
                  >
                    Batik Saya
                  </Link>

                  <Link
                    href="/histori"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 py-2 block text-md mt-3"
                  >
                    Histori Pembelian
                  </Link>
                </div>
              </>
            )}

            <div className="flex w-full flex-col gap-3 pt-4 border-t border-gray-500 mt-1">
              {isLoading ? (
                <div className="w-full h-10 bg-white/20 rounded animate-pulse"></div>
              ) : isLoggedIn && userData.id ? (
                <NavbarButton
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  variant="secondary"
                  className="w-full font-semibold text-white bg-red-600"
                >
                  Log Out
                </NavbarButton>
              ) : (
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
              )}
            </div>
          </MobileNavMenu>
        </div>
      </div>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    <ModalRegisterSeller isOpen={modalRegisterSeller.isOpen} onOpen={modalRegisterSeller.onOpen} onOpenChange={modalRegisterSeller.onOpenChange} onClose={modalRegisterSeller.onClose} />
    </>
  );
}