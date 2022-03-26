import { GetStaticProps } from 'next';
import Prismic from 'prismic-javascript';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import SEO from '../../components/SEO';
import { getPrismClient } from '../../services/prismic';

import styles from './post.module.scss';

interface Post {
  post: {
    slug: string;
    title: string;
    content: string;
    updateAt: string;
  };
}

export default function Post({ post }: Post) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <SEO title="Post" />

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updateAt}</time>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismClient();

  const results = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(results.data.title),
    content: RichText.asHtml(results.data.content),
    updateAt: new Date(results.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  };

  return {
    props: { post }, // will be passed to the page component as props
    revalidate: 60 * 60 * 12,
  };
};
