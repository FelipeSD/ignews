import {render} from '@testing-library/react'
import {SignInButton} from "./index";
import {useSession} from 'next-auth/client'

jest.mock('next-auth/client');

describe('SignInButton component', () => {
    it('should renders correctly when user is not logged in', () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);

        const { getByText } = render(
            <SignInButton />
        );

        expect(getByText('Sign in with Github')).toBeInTheDocument();
    });

    it('should renders correctly when user is logged in', () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce([{
            user: {
                name: 'John Doe',
                email: 'john',
            },
            expires: 'fake-expires'
        }, false]);

        const { getByText } = render(
            <SignInButton />
        )

        expect(getByText('John Doe')).toBeInTheDocument();
    });
});
