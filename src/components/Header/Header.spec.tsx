import {render} from '@testing-library/react'
import {Header} from "./index";

jest.mock('next/dist/client/router', () => {
    // mock library
    return {
        useRouter: () => {
            return {
                asPath: '/'
            }
        }
    }
});

jest.mock('next-auth/client', () => {
    // mock library
    return {
        useSession() {
            return [null, false]
        }
    }
});

describe('Header component', () => {
    it('should renders correctly', () => {
        const {getByText} = render(
            <Header/>
        )

        expect(getByText('Home')).toBeInTheDocument();
    });
});
