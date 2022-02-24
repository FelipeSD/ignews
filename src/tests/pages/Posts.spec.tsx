import {render, screen} from '@testing-library/react';
import Posts, {getStaticProps} from "../../pages/posts";
import {getPrismicClient} from '../../services/prismic';

const posts = [
  {slug: 'post-1', title: 'Post 1', excerpt: 'Post 1 excerpt', updatedAt: '19 de Maio'},
]

jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />);
    expect(screen.getByText('Post 1')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my1',
            data: {
              title: [{type: 'heading', text: 'My post 1'}],
              content: [
                {type: 'paragraph', text: 'Post excerpt 1'},
              ]
            },
            last_publication_date: '01-03-2022',
          }
        ]
      })
    } as any)

    const response = await getStaticProps({});

    expect(response).toEqual(
        expect.objectContaining({
          props: {
            posts: [{
              slug: 'my1',
              title: 'My post 1',
              excerpt: 'Post excerpt 1',
              updatedAt: '03 de janeiro de 2022'
            }]
          }
        })
    )
  })
});
