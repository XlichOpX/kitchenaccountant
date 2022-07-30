import { ReactNode } from "react";

const Header = ({ children }: { children: ReactNode }) => (
  <header className="bg-white p-0">{children}</header>
);

export default Header;
