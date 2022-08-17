# Store Manager

# Contexto
Este projeto trata-se de uma API RESTful, que faz gerenciamento de vendas no formato dropshipping em que é possível criar, visualizar, deletar e atualizar produtos e vendas.
Foi prouzido utilizando a arquitetura MSC (model-service-controller)!

## Técnologias usadas

Back-end:

> Desenvolvido usando: NodeJS, ExpressJS, MYSQL

## Como rodar via Docker

  > Configure suas variaveis no dockerfile

  ```bash
  git clone git@github.com:Vitosoaresp/store-manager.git
  cd store-manager
  docker-compose up -d
  docker exec -it store_manager bash
  npm install
  npm run migration
  ```

## Como rodar Sem Docker

> Crie um arquivo .env e configure as variaveis

 ```bash
  git clone git@github.com:Vitosoaresp/store-manager.git
  cd store-manager
  npm install
  ```

## Para rodar os Tests

> ```npm run test```

## Endpoints

- [GET] http://localhost:3000/products
- [GET] http://localhost:3000/products/id
- [GET] http://localhost:3000/products/search?q=SUA_BUSCA
- [GET] http://localhost:3000/sales
- [GET] http://localhost:3000/sales/id

  #### Criar ou Atualizar um produto
  
  > Body da requisição deve conter algo como:
    ```bash
     {
      "name": "Nome do produto"
     }
    ```


  #### Criar ou Atualizar uma venda
  
  > Body da requisição deve conter algo como:
    ```bash
  [
      {
        "productId": 1,
        "quantity":1
      },
      {
        "productId": 2,
        "quantity":5
      }
  ]

    ```


