import { useState } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import { SignInButton } from "../SignInButton";
import { ActiveLink } from "../ActiveLink";
import styles from "./styles.module.scss";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    console.log("toggleMenu");
    setIsOpen(!isOpen);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <button className={styles.menuButton} onClick={toggleMenu}>
          <BiMenuAltLeft size={30} color="white" />
        </button>

        <img src="/images/logo.svg" alt="ig.news" />

        <nav className={`${styles.menuNav} ${isOpen ? styles.open : ''}`}>
          <ActiveLink href="/" activeClassName={styles.active}>
            Home
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            Posts
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
