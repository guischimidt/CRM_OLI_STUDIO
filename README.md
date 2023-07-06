<table>
  <tr>
    <td><img src="https://github.com/guischimidt/OLI_STUDIO/blob/master/frontend/src/assets/img/logo-circle.png" style="width: 48px;" /></td>
    <td><h1>Óli Studio</h1></td>
  </tr>
</table>

## Preview


https://user-images.githubusercontent.com/94488086/195472563-e104ad8b-7b70-401d-938d-0fc5e6bdf46c.mp4


## Conteúdo
* [Sobre o Projeto](#sobre-o-projeto)
* [Tecnologias](#hammer_and_wrench-tecnologias)
* [Iniciando a Aplicação](#car-Iniciando-a-aplicação)
* [Licença](#balance_scale-licença)
* [Contato](#email-contato)

## Sobre o projeto

É uma aplicação desenvolvida com o intuito de otimizar o trabalho da minha esposa, em seu Studio. <br />
Nesta aplicação há a possibilidade de cadastro de clientes, gerenciamento de agendamentos (integrado com Google Calendar),  <br />
envio automático de mensagens via WhatsApp para as clientes, cadastro de procedimentos e preços, gerenciamento de taxas de cartão, <br />
recebimento dos procedimentos, relatórios financeiros (em desenvolvimento) e gerenciamento de insumos (a desenvolver).<br /><br />

É composta por um backend em __Node.js__, um frontend em __React__ e um Server para envio das mensagens via WhatsApp.<br />
A API trabalha com banco de dados __MongoDB__ e autenticação JWT (a desenvolver).<br />
<br />

### Rotas da aplicação

| Método | Caminho da Rota | Descrição da Rota |
|---|---|---|
| POST | http://localhost:5000/config/procedures/create | Cadastra um novo procedimento |
| PATCH | http://localhost:5000/config/procedures/:id | Atualiza um procedimento |
| DELETE | http://localhost:5000/config/procedures/:id | Deleta um procedimento |
| GET | http://localhost:5000/config/procedures/:id | Busca um procedimento pelo Id |
| GET | http://localhost:5000/config/procedures/ | Exibe todos os procedimentos cadastrados |
| POST | http://localhost:5000/config/payments/create | Cria uma forma de pagamento |
| PATCH | http://localhost:5000/config/payments/:id | Atualiza uma forma de pagamento |
| DELETE | http://localhost:5000/config/payments/:id | Deleta uma forma de pagamento |
| GET | http://localhost:5000/config/payments/:id | Busca uma forma de pagamento pelo Id |
| DELETE | http://localhost:5000/config/payments/ | Exibe todas as formas de pagamento |
| POST | http://localhost:5000/customers/create | Cadastra uma nova cliente |
| PATCH | http://localhost:5000/customers/edit/:id | Atualiza uma cliente |
| GET | http://localhost:5000/customers/name/:name | Busca uma cliente pelo nome |
| GET | http://localhost:5000/customers/:id | Busca uma cliente pelo Id |
| DELETE | http://localhost:5000/customers/:id | Deleta uma cliente |
| GET | http://localhost:5000/customers/ | Busca uma cliente pelo Id |
| POST | http://localhost:5000/schedules/create | Cria um novo agendamento |
| PATCH | http://localhost:5000/schedules/:id | Atualiza um agendamento |
| GET | http://localhost:5000/schedules/:name | Busca um agendamento pelo nome da cliente |
| GET | http://localhost:5000/schedules/status/:status | Busca um agendamento pelo seu status |
| POST | http://localhost:5000/schedules/sendMessage | Faz a verificação de mensagens pendentes e realiza o envio para as clientes |
| GET | http://localhost:5000/schedules/ | Exibe todos os agendamentos |


## :hammer_and_wrench: Tecnologias
* Back-end
  * __Node.js__
  * __Mongoose ORM__ para acessar o banco
  * __Cors__ para liberar acesso à API
  * __jsonwebtoken__ para criar uma sessão (em breve)
  * __Multer__ para fazer upload de imagens (em breve)
* Front-end
  * __React__
  * __React-Router-DOM__ para rotas
  * __Axios__ para acessar API


## :car: Iniciando a aplicação
Baixe o repositório com git clone e entre na pasta do projeto.
```bash
$ git clone https://github.com/guischimidt/OLI_STUDIO
```


### __Back-end__
  Na pasta backend, instale as dependências
```bash
$ cd backend
$ npm install
$ npm start
```
### __Front-end__
  Na pasta frontend, instale as dependências.
```bash
$ cd ..
$ cd frontend
$ npm install
$ npm start
```
### __WhatsApp__
  Na pasta frontend, instale as dependências.
```bash
$ cd ..
$ cd whatsapp
$ npm install
$ npm start
```


## :balance_scale: Licença
Este projeto está licenciado sob a [licença MIT](LICENSE).

## :email: Contato

E-mail: [**guigoschimidt@gmail.com**](mailto:guigoschimidt@gmail.com)
