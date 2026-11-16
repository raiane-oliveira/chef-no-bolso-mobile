import { useIsDesktop } from "@/shared/hooks/use-is-desktop";
import { NavbarDesktop } from "./navbar-desktop";
import { NavbarMobile } from "./navbar-mobile";

export function Navbar() {
  const isDesktop = useIsDesktop();

  if (isDesktop === null) return null;

  return isDesktop ? <NavbarDesktop /> : <NavbarMobile />;
}
