# Ignews

![GitHub repo size](https://img.shields.io/github/repo-size/fezoide/ignews)
![GitHub language count](https://img.shields.io/github/languages/count/fezoide/ignews)
![GitHub forks](https://img.shields.io/github/forks/fezoide/ignews)
![Bitbucket open issues](https://img.shields.io/bitbucket/issues/fezoide/ignews)
![Bitbucket open pull requests](https://img.shields.io/bitbucket/pr-raw/fezoide/ignews)

<img src="https://user-images.githubusercontent.com/18513213/155630154-2e7e79c0-6d06-43fc-9014-4e8f58fc243d.png" alt="home page" />

> Ignews é um projeto final desenvolvido no bootcamp Ignite da Rocketseat. Possui comunicação com Github (autenticação), Stripe (assinatura), Prismic CMS (repositório 
> de notícias) e FaunaDB (banco de dados)

## 🚀 Para começar

Para usar em sua máquina local, siga estas etapas:
### Instale as dependências
Utilizando yarn:
```
yarn
```
Utilizando npm:
```
npm install
```
### Configure as variáveis de ambiente
Crie um arquivo `.env.local` com as chaves de acesso seguindo o exemplo de ![env.local.example](https://github.com/fezoide/ignews/blob/main/.env.local.example)

### Inicie o servidor de desenvolvimento
```
yarn dev
```
### Configurando FaunaDB
#### Collections
<table>
  <thead>
    <tr>
      <th>Subscriptions</th>
      <th>Users</th>
    </tr>
  </thead>
  <tr>
    <td> <img src="https://user-images.githubusercontent.com/18513213/155633661-a56315db-dfb2-4a65-9dcd-c9f90a2f2c07.png" /> </td>
    <td> <img src="https://user-images.githubusercontent.com/18513213/155633588-f199d978-b868-4360-8419-574a4bb9ff14.png" </td>
  </tr>
</table>

#### Indexes

<table>
  <thead>
    <tr>
      <th>Index name</th>
      <th>Terms</th>
    </tr>
  </thead>
  <tr>
    <td> subscription_by_id </td>
    <td> data.id </td>
  </tr>
  <tr>
    <td> subscription_by_status </td>
    <td> data.status </td>
  </tr>
  <tr>
    <td> subscription_by_user_ref </td>
    <td> data.userId </td>
  </tr>
  <tr>
    <td> user_by_email </td>
    <td> data.email </td>
  </tr>
  <tr>
    <td> user_by_stripe_customer_id </td>
    <td> data.stripeCustomerId </td>
  </tr>
</table>

## ☕ Usando o Ignews

Para usar o Ignews, siga estas etapas:
* Acesse o link de produção
![https://ignews-felipesd.vercel.app](https://ignews-felipesd.vercel.app)
* Clique em `Sign in with Github` e logue com sua conta
* Clique em Subscribe para ver os post com detalhes
* Na tela de pagamentos do Stripe, utilize o número de teste do cartão de crédito: `4242 4242 4242 4242`. As demais informações podem ser quaisquer.

[⬆ Voltar ao topo](#nome-do-projeto)<br>
