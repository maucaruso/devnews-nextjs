import { render } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import Post, { getStaticProps } from '../../pages/posts/[slug]';
import { getPrismClient } from '../../services/prismic';

const post = {
  slug: 'test-new-post',
  title: 'title for new post',
  content: '<p>post excerpt</p>',
  updateAt: '25 de dezembro de 2021',
};

jest.mock('../../services/prismic');

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        isFallback: false,
      };
    },
  };
});

describe('Post page', () => {
  it('renders correctly', () => {
    const { getByText, getByAltText } = render(<Post post={post} />);

    expect(getByText('title for new post')).toBeInTheDocument();
  });
  it('loads initial data', async () => {
    const getPrismClientMocked = mocked(getPrismClient);
    getPrismClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'My new Post' }],
          content: [{ type: 'paragraph', text: '<p>post excerpt</p>' }],
        },
        last_publication_date: '12-25-2021',
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: 'test-new-post' },
    });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'test-new-post',
            title: 'My new Post',
            content: '<p>post excerpt</p>',
            updateAt: '25 de dezembro de 2021',
          },
        },
        revalidate: 43200,
      }),
    );
  });
});
