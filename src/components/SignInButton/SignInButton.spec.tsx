import {render} from '@testing-library/react'
import {SignInButton} from "./index";
import {useSession, signOut, signIn} from 'next-auth/client'

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

    it('should sign in when user is not logged in', () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);

        const signInMocked = jest.mocked(signIn);

        const { getByText } = render(
            <SignInButton />
        );

        getByText('Sign in with Github').click();

        expect(signInMocked).toHaveBeenCalled();
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

    it('should sign out when user clicks on button', () => {
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

        const signOutMocked = jest.mocked(signOut)
        const signButton = getByText('John Doe');
        signButton.click();
        expect(signOutMocked).toHaveBeenCalled();
    });
});
