import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.wrap}>
        <p>&copy; {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <p>Developer: Arsenii</p>
        <a
          href="https://github.com/Arsenii-21/09-auth"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
