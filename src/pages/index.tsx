import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: string
  }
}

export default function Home({product}: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

// usar Server Side para buscar dados no servidor de forma dinamica otimizada para indexação por SEO
// usar Static Props apenas quando a mesma informação pode ser exibida para todos os usuarios
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JjqiHGH8oo78tpPVdIhm0Mn', { 
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100), // sempre esta em centavos
  }

  return {
    props: {
      product
    },
    revalidate: 60*60*24, // quando tempo em segundos a pagina deve ser recarregada: 24 hours
  }
}
