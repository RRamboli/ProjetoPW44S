import React, { useEffect } from "react";
import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import AuthService from "@/services/auth-service.ts";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser()?.username || "Usuário";
  const { authenticated, handleLogout } = useAuth();

  // Tema Dark fixo
  useEffect(() => {
    const themeLink = document.getElementById("theme-link") as HTMLLinkElement;

    themeLink.href =
      "https://unpkg.com/primereact/resources/themes/lara-dark-blue/theme.css";

    localStorage.setItem("theme", "dark");
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  const items: MenuItem[] = authenticated
    ? [
        { label: "Home", icon: "pi pi-home", command: () => navigate("/") },
               
        { label: "Carrinho", icon: "pi pi-shopping-cart", command: () => navigate("/cart") },
      ]
    : [];

  const start = (
    <div
      className="flex align-items-center gap-2 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img
        src="/assets/images/BiteWizeStoreLogo.png"
        alt="Logo"
        height={32}
        style={{ objectFit: "contain" }}
      />
      <span className="font-bold text-lg hidden sm:block">BiteWizeStore</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">

      {/* Ícone do Carrinho */}
      <i
        className="pi pi-shopping-cart text-xl cursor-pointer"
        onClick={() => navigate("/cart")}
        style={{ marginTop: "3px" }}
      />

      {authenticated && (
        <>
          <span className="font-semibold hidden sm:block">{user}</span>

          <Avatar
            image="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Caleb"
            shape="square"
            className="cursor-pointer"
            onClick={() => navigate("/shopping-list")}
          />

          <Button
            icon="pi pi-sign-out"
            className="p-button-text"
            onClick={handleLogoutClick}
          />
        </>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "var(--surface-ground)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
      className="fixed top-0 left-0 w-full z-50"
    >
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default TopMenu;
