"use client";

import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Button,
  createTheme, 
} from "flowbite-react";

import { usePathname } from 'next/navigation';
import { jwtDecode} from 'jwt-decode';
import Link from "next/link";


export function Component() {

  const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
  let decoded = null;

  if (token) {
    decoded = jwtDecode(token);
    // render into your components…
  }

  const newNavbarTheme = createTheme ({
    navbar: {
      "root": {
        "base": "bg-white px-2 py-2.5 sm:px-4 dark:border-gray-700 dark:bg-gray-800",
        "rounded": {
          "on": "rounded",
          "off": ""
        },
        "bordered": {
          "on": "border",
          "off": ""
        },
        "inner": {
          "base": "mx-auto flex flex-wrap items-center justify-center gap-16", //aligns branding with nav links
          "fluid": {
            "on": "",
            "off": "container"
          }
        }
      },
      "brand": {
        "base": "flex items-center justify-center"
      },
      "collapse": {
        "base": "w-full md:block md:w-auto",
        "list": "mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium", //aligns dropdown menu with nav links
        "hidden": {
          "on": "hidden",
          "off": ""
        }
      },
    },
    "link": {
      "base": "block py-2 pl-3 pr-4 md:p-0",
      "active": {
        "on": "md:hover:text-primary-700",
        "off": ""
      },
      
    }
   
  });
  const currentPage = usePathname();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
  };

  return (
    
    <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900">
      <Navbar className="h-16 shadow-lg" fluid rounded theme = {newNavbarTheme.navbar}>
        {/* Logo */}
        <NavbarBrand href="/dashboard" >
        
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            QUANTUM
          </span>
        </NavbarBrand>

        {/* Profile Dropdown */}
        <div className="flex md:order-2">
          <Dropdown label="My Profile" dismissOnClick={false} arrowIcon={true} pill>
            <DropdownHeader className="top-7 bottom-36">
              {/*<span className="block text-sm">My Account</span>*/}
              <span className="block truncate text-sm font-medium">{decoded.sub}</span>
            </DropdownHeader>
            <DropdownItem href="/dashboard">Dashboard</DropdownItem>
            <DropdownItem href="/settings">Settings</DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/" onClick={handleLogout}>Sign out</DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>

        {/* Nav Links */}
        <NavbarCollapse>
          <NavbarLink
            href="/dashboard"
            active={currentPage === '/dashboard'}
            className={`relative text-base after:absolute after:left-0 after:bg-[#016747]  after:bottom-0 after:h-[2.5px] after:transition-all after:duration-300 '${
                currentPage === '/dashboard' ? '' : 'after:w-0 hover:after:w-full after:bottom-[-6px]'
              }`}
          >
            Dashboard
          </NavbarLink>
          <NavbarLink
            href="/budget_dashboard"
            active={currentPage === '/budget_dashboard'}
            className={`relative text-base  after:absolute after:left-0 after:bg-[#016747] after:bottom-0 after:h-[2.5px]  after:transition-all after:duration-300' ${
                currentPage === '/budget_dashboard' ? '' : '  after:w-0 hover:after:w-full after:bottom-[-6px]'
              }`}
          >
            Budgeting
          </NavbarLink>
          <NavbarLink
            href="/transfer"
            className={`relative text-base  after:absolute after:left-0 after:bg-[#016747] after:bottom-0 after:h-[2.5px] after:transition-all after:duration-300'${
                currentPage === '/transfer' ? '' : ' after:w-0 hover:after:w-full after:bottom-[-6px]'
              }`}
            active={currentPage === '/transfer'}
          >
           Transfer
          </NavbarLink>
        </NavbarCollapse>
      </Navbar>
    </div>
  );
}
