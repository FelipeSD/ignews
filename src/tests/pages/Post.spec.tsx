import {render, screen} from '@testing-library/react';
import Post, {getServerSideProps} from "../../pages/posts/[slug]";
import {getSession} from "next-auth/client"
import {getPrismicClient} from "../../services/prismic";

const post = {
    slug: 'post-1',
    title: 'Post 1',
    content: '<p>Post 1 excerpt</p>',
    updatedAt: '19 de Maio'
}

jest.mock('next-auth/client')
jest.mock('../../services/prismic')

describe('Post page', () => {
    it('renders correctly', () => {
        render(<Post post={post}/>);
        expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    it('redirects user if no subscription is found', async () => {
        const getSessionMocked = jest.mocked(getSession)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        })

        const response = await getServerSideProps({
            params: {
                slug: 'post-1'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                })
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMocked = jest.mocked(getSession)
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{type: 'heading', text: 'My post 1'}],
                    content: [
                        {type: 'paragraph', text: 'Post excerpt 1'},
                    ],
                },
                last_publication_date: '04-01-2022',
            })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-subscription'
        })

        const response = await getServerSideProps({
            params: {
                slug: 'post-1'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'post-1',
                        title: 'My post 1',
                        content: 'Post excerpt 1',
                        updatedAt: '01 de abril de 2022'
                    }
                }
            })
        )
    })
});
