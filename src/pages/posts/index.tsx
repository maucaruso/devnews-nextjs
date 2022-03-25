import { GetStaticProps } from 'next';
import Prismic from 'prismic-javascript';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { getPrismClient } from '../../services/prismic';
import styles from './posts.module.scss';

interface Post {
  id: string;
  title: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts() {
  return (
    <>
      <SEO title="Posts" />

      <main className={styles.container}>
        <div className={styles.posts}>
          <Link href="">
            <a>
              <time>25 de dezembro de 2021</time>
              <strong>Titulo</strong>

              <p>Paragrafo</p>
            </a>
          </Link>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismClient();

  const response = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content'],
    },
  );

  console.log(response);

  return {
    props: {}, // will be passed to the page component as props
    revalidate: 60 * 60 * 12,
  };
};
