import {render, screen} from '@testing-library/react';
import PostPreview, {getStaticProps} from "../../pages/posts/preview/[slug]";
import {useSession} from "next-auth/client"
import {getPrismicClient} from "../../services/prismic";
import { useRouter } from "next/dist/client/router"

const post = {
    slug: 'post-1',
    title: 'Post 1',
    content: '<p>Post 1 excerpt</p>',
    updatedAt: '19 de Maio'
}

jest.mock('next-auth/client')
jest.mock('../../services/prismic')
jest.mock('next/dist/client/router')

describe('Post preview page', () => {
    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce([null, false])

        render(<PostPreview post={post}/>);

        expect(screen.getByText('Post 1')).toBeInTheDocument();
        expect(screen.getByText('Post 1 excerpt')).toBeInTheDocument();
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    });

    it('redirects user to full post when user is subscribed', async () => {
        const useRouterMocked = jest.mocked(useRouter)
        const pushMocked = jest.fn()

        useRouterMocked.mockReturnValueOnce({
            push: pushMocked
        } as any)

        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValueOnce([
            {activeSubscription: 'subscription-1'},
            false
        ])

        render(<PostPreview post={post}/>);

        expect(pushMocked).toHaveBeenCalledWith('/posts/post-1')
    })

    it('loads initial data', async () => {
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

        const response = await getStaticProps({params: {slug: 'post-1'}})

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
