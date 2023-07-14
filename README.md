# Projeto Labeddit - Back-end

### Descrição

O projeto labeddit é um aplicativo que permite aos usuários criar contas, fazer login, criar postagens, curtir postagens e comentar em postagens. Este repositório contém o código-fonte do back-end do projeto, que foi desenvolvido utilizando as seguintes tecnologias: ExpressJS, TypeScript e SQLite.

Para verificar o repositorio do front-end [Clique aqui](https://github.com/Matheusbcy/labeddit-front-end)

### Funcionalidades

O back-end oferece as seguintes funcionalidades:

- Registro de usuário: Permite que novos usuários se cadastrem no sistema fornecendo informações como nome de usuário, senha e endereço de e-mail.
- Login de usuário: Permite que usuários registrados façam login no sistema.
- Criação de postagens: Usuários autenticados podem criar novas postagens, fornecendo um título e conteúdo para cada postagem.
- Curtir postagens: Usuários autenticados têm a capacidade de curtir as postagens de outros usuários.
- Comentários em postagens: Usuários autenticados podem fazer comentários nas postagens existentes.
- Curtir comentários: Usuários autenticados podem curtir postagens de outros usuários.

### Mecanismos de Proteção

- Jsonwebtoken: Todos os endpoints de posts são protegidos por token e necessita de o usuário ser autenticado para conseguir acessar.
- Bcryptjs: Todas as senhas no banco de dados são criptografadas.
- Uuid: Todas os id de usuários são criados aleatoriamente no momento do cadastro.

## Configuração e Uso

Siga as instruções abaixo para configurar e executar o projeto em sua máquina local:

1. Certifique-se de ter o Node.js e o NPM (Node Package Manager) instalados em sua máquina.
2. Clone este repositório para o seu diretório local usando o seguinte comando:

```bash
git clone https://github.com/seu-usuario/labeddit-back-end.git
```

3. Acesse o diretório do projeto:

```bash
cd nome-do-repositorio
```

4. Instale as dependências do projeto executando o seguinte comando:

```bash
npm install
```

5. Configure o arquivo .env no seu projeto.
6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

7. O servidor será executado localmente e estará disponível em http://localhost:3000.

## Testes

Para executar os testes automatizados do projeto, utilize o seguinte comando:

```bash
npm run test
```

Os testes garantem que a lógica de negócios do projeto esteja funcionando corretamente e fornecem uma cobertura mínima de 70% das funcionalidades.

## Deploy

O deploy do back-end está disponivel em: [Link do deploy](https://labeddit-back-end-i352.onrender.com/)

## Endpoint

A API oferece os seguintes endpoints seguindo as boas práticas HTTP:

Os endpoint estão disponivel na documentação [Link da documentação](https://documenter.getpostman.com/view/24823033/2s946eBuAR#8fdfdd9d-dcc6-4afa-80c6-11c5eeecb303)

### Autor

Matheus Freitas - [Github Matheus Freitas](https://github.com/Matheusbcy)  


 