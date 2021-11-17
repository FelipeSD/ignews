import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

// usar chaves secretas em:
// getServerSideProps (SSR)
// getStaticProps (SSG)
// API routes

export function SubscribeButton({priceId}: SubscribeButtonProps){
    const [session] = useSession();
    const router = useRouter()

    async function handleSubscribe(){
        if(!session){
            signIn('github');
            return;
        }
        console.log(session);
        if(session.activeSubscription){
            router.push('./posts');
            return
        }

        // criação da checkout session
        try {
            const response = await api.post('/subscribe');
            const { sessionId } = response.data as { sessionId: string };
            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({
                sessionId,
            });
        } catch(err) {
            console.error(err.message);
        }
    }
    return (
        <button
            onClick={handleSubscribe}
            className={styles.subscribeButton}
            type="button"
        >
            Subscribe
        </button>
    );
}