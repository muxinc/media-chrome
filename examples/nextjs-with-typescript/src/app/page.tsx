import Link from 'next/link';
import styles from './styles.module.css';

function HomePage() {
  return (
    <nav>
      <ul className={styles.ul}>
        <li>
          <Link className={styles.link} href="/media-store-hooks">
            <code>MediaStore</code>&nbsp;react hooks + React components example
          </Link>
        </li>
        <li>
          <Link className={styles.link} href="/material-ui-player-chrome">
            <code>MediaStore</code>&nbsp;react hooks + Material UI example
          </Link>
        </li>
        <li>
          <Link className={styles.link} href="/react-wrappers">
            Media Chrome react wrapper components example
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default HomePage;
