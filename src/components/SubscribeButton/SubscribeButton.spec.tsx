import {render, fireEvent} from '@testing-library/react'
import {SubscribeButton} from "./index";
import {signIn, useSession} from 'next-auth/client'
import {useRouter} from "next/dist/client/router";

jest.mock('next-auth/client');
jest.mock('next/dist/client/router');

describe('SubscribeButton component', () => {
    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValue([null, false]);

        const { getByText } = render(<SubscribeButton />);

        expect(getByText('Subscribe')).toBeInTheDocument();
    });

    it('redirects to sign in when not authenticated', ()=>{
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValue([null, false]);

        const signInMocked = jest.mocked(signIn);

        const { getByText } = render(<SubscribeButton />);

        const subscribeButton = getByText('Subscribe');

        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled();
    });

    it('redirects to posts when user already has a subscription', ()=>{
        const useRouterMocked = jest.mocked(useRouter);
        const useSessionMocked = jest.mocked(useSession);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce([{
            user: {
                name: 'John Doe',
                email: 'john',
            },
            activeSubscription: 'fake-subscription-id',
            expires: 'fake-expires'
        }, false]);

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        const { getByText } = render(<SubscribeButton />);

        const subscribeButton = getByText('Subscribe');

        fireEvent.click(subscribeButton);

        expect(pushMock).toHaveBeenCalledWith('/posts');
    });
});
