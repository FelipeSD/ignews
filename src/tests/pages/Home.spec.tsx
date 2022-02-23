import {render, screen} from '@testing-library/react';
import Home, {getStaticProps} from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
})
jest.mock('../../services/stripe');

describe('Home', () => {
  it('renders correctly', () => {
    render(<Home product={{priceId: 'fake-priceId', amount: 'R$10,00'}} />);
    expect(screen.getByText(/R\$10,00/i)).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve);

    // quando é asincrono é necessário usar o mockResolvedValue
    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-priceId',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({});

    expect(response).toEqual(
        expect.objectContaining({
          props: {
            product: {
              priceId: 'fake-priceId',
              amount: '$10.00'
            }
          }
        })
    )
  })
});
