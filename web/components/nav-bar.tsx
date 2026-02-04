import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChartPie, Heart, ShoppingCart, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export const NavBar = () => {
  return (
    <nav className="relative bg-gray-800 dark:bg-gray-800/50 dark:after:pointer-events-none dark:after:absolute dark:after:inset-x-0 dark:after:bottom-0 dark:after:h-px dark:after:bg-white/10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                data-slot="icon"
                aria-hidden="true"
                className="size-6 in-aria-expanded:hidden">
                <path
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                data-slot="icon"
                aria-hidden="true"
                className="size-6 not-in-aria-expanded:hidden">
                <path
                  d="M6 18 18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Image
                src="https://www.wingmall.com/images/logo_wingmall.svg"
                alt="Wingmall logo"
                width={100}
                height={100}
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-white font-light bg-transparent hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10">
                        Shop
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          <ListItem href="/docs" title="Introduction">
                            Re-usable components built with Tailwind CSS.
                          </ListItem>
                          <ListItem
                            href="/docs/installation"
                            title="Installation">
                            How to install dependencies and structure your app.
                          </ListItem>
                          <ListItem
                            href="/docs/primitives/typography"
                            title="Typography">
                            Styles for headings, paragraphs, lists...etc
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <Link
                  href="#"
                  className="flex items-center rounded-md px-3 py-2 text-sm font-light text-white hover:bg-white/5 hover:text-white">
                  New Arrival
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href="#"
              className="flex items-center rounded-md space-x-2 px-3 py-2 text-md text-white font-md hover:bg-white/5 hover:text-white">
              <ShoppingCart className="size-5" />
              <span>Cart</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg- font-md text-md text-white rounded-full hover:bg-white/5 hover:text-white">
                  <User />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <ChartPie />
                    <Link href={"/customer/dashboard"}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShoppingCart />
                    <Link href={"/customer/orders"}>Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart />
                    <Link href={"/customer/wishlist"}>Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User />
                    <Link href={"/customer/profile"}>Profile</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground line-clamp-2">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
