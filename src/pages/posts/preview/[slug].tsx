import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/client"
import { useRouter } from "next/dist/client/router"
import Head  from "next/head"
import Link from 'next/link'
import { RichText } from "prismic-reactjs"
import { useEffect } from "react"
import { getPrismicClient } from "../../../services/prismic"
import styles from '../post.module.scss'

interface PostPreviewProps {
    post: {
        slug: string
        title: string
        content: string
        updatedAt: string
    }
}


export default function PostPreview({post}: PostPreviewProps){
    const [session] = useSession();
    const router = useRouter();

    useEffect(() => {
        if(session?.activeSubscription){
            router.push(`/posts/${post.slug}`);
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{__html: post.content}} 
                    />

                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/posts/[slug]">
                            <a>Subscribe now 😚</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = () => {
    // retorna quais caminhos, previews de posts são gerados durante a build
    return {
        paths: [], // todos os posts são carregados no primeiro acesso
        fallback: 'blocking' // ao acessar conteudo que não foi gerado estático, ele carrega de novo e quando todo conteudo carregar libera a página
        // fallback: false // se não houver posts, não carrega nada (404)
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const {slug} = params;

    const prismic = getPrismicClient()
    const response = await prismic.getByUID('post', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asText(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }),
    }

    return {
        props: {
            post
        },
        redirect: 60 * 30, // atualiza a cada 30 minutes
    }

}
