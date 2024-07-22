# Rest-API de Avaliações
Esse é um projeto onde você pode criar, ler, filtrar, atualizar e deletar avaliações.

## Iniciando o projeto
Para executar o projeto é necessário ter o **Node.js** e o **npm** instalados em seu sistema.
Para instalar as dependências do projeto você deve executar a linha de código abaixo em seu terminal.

```bash
  npm install
```

crie um arquivo chamado .env na raiz do projeto e adicione as variárveis de ambiente seguindo o exemplo do arquivo .env.example

## Configuração do Ambiente

Para configurar as variáveis de ambiente do projeto, você deve criar um arquivo `.env` na raiz do seu projeto, seguindo o exemplo do arquivo `.env.example` com as seguintes variáveis:

```dotenv
# Segredo usado para assinatura de tokens JWT
JWT_SECRET=seu_segredo_aqui

# URL do host onde o aplicativo está rodando
HOST=localhost

# Porta na qual o servidor vai escutar
PORT=5000

# URL de conexão com o banco de dados MongoDB
MONGODB_URL=mongodb://localhost:27017/meubanco
```
## Em seguida, execute o comando a seguir para executar o seeder:

```bash
  npm run create:seeder
```

## Em seguida, execute o comando a seguir para executar o projeto:

```bash
  npm run dev
```

## O seu terminal irá exibir:

```bash
 Started Server
  [2024-07-22 18:44:00.187 -0300] INFO (354721): InitDb started
  [2024-07-22 18:44:00.189 -0300] INFO (354721): development
  [2024-07-22 18:44:00.189 -0300] INFO (354721): Server is running
  [2024-07-22 18:44:00.189 -0300] INFO (354721): on http://localhost:<sua porta>
  [2024-07-22 18:44:00.190 -0300] INFO (354721): RunServer started
  [2024-07-22 18:44:00.190 -0300] INFO (354721): Docs available at http://localhost:<sua porta>/docs
```

## Documentação do Swagger
É possível visualizar a documentação em execução na Url retornada no terminal:

```bash
  [2024-07-22 18:44:00.190 -0300] INFO (354721): Docs available at http://localhost:<sua porta>/docs
```

## Tecnologias utilizadas
- [NodeJs](https://nodejs.org/pt)
- [Express](https://expressjs.com/)
- [Jest](https://jestjs.io/docs/next/getting-started)
- [Supertest](https://www.npmjs.com/package/supertest)
- [MongoDB](https://www.mongodb.com/)

## Testes Unitários e de Integração
Para realização de testes você deve executar os seguintes comandos:

**Test Witch Watch Silent**
```bash
   npm run test:dev
```

**Test Witch Watch Verbose**
```bash
   npm run test:dev:verbose
```

**Test Coverage**
```bash
   npm run test:coverage
```
