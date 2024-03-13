import Link from 'next/link';
import styles from './styles.module.css';

function HomePage() {
  return (
    <nav>
      <ul className={styles.ul}>
        <li>
          <Link className={styles.link} href="/media-store-hooks">
            <code>MediaStore</code> react hooks + React components example
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
