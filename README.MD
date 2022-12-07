# Keycloak + Vue.js + Express.JS

- Exemplo simples de servidor de autenticação centralizado para acesso entre frontend e microserviços de backend  
- Basicamente a ideia é mapear o frontend e services de backend no Keycloak, para que no frontend ao autenticar uma vez,
ele salva o token e via axios já adiciona no header para acessar os services que estão protegidos de acordo com seu nivel de acesso

### Rodar projeto
```
docker-compose up --build
```

### Criar realm (seria como um namespace para um sistema com N serviços)
name: myrealm
### Criar clients para cada service

#### Para frontend
Client
name: vue-web-app 
url: http://localhost:8080
access type: public
    
#### Para service do backend
Client:
name: node-microservice
url: http://localhost:5000
access type: Confidential (marcar para exibir opções abaixo)
Service Accounts Enabled:ON
Authorization Enabled:ON

#### Criar funções do usuário dentro do sistema

#### Criar roles
Roles > criar roles: app-admin e app-user(sera usado tanto para o frontend como para o backend)

##### Funções para admin e usuario para frontend:
Client > vue-web-app > roles > criar usuario 'admin' e 'user'
Depois de criar ativar Composite Roles como ON para as duas roles, onde composite roles
vai receber client roles: 'vue-web-app' e depois em 'available roles' adicionar 'admin' para app-admin e o
mesmo para app-user mas recebendo 'user'

##### Funções para admin e usuario para backend:
Client > node-microservice > roles > criar usuario 'admin' e 'user'
Depois de criar ativar Composite Roles como ON para as duas roles, onde composite roles
vai receber client roles: 'node-microservice' e depois em 'available roles' adicionar 'admin' para app-admin e o
mesmo para app-user mas recebendo 'user'

### Criar usuários de acesso
Criar usuários: user1, user2, user3
Na aba credentials, criar senha e remover temporary e clicar em set password para cada user

#### Marcar roles mappings para cada um
Em role mappings > assigned roles > marcar o app-user para user1
Em role mappings > assigned roles > marcar o app-admin para user2
Em role mappings > assigned roles > marcar o app-user e app-admin para user3

### Criar scope mapper de forma compartilha entre clients
Client scopes > name:client_roles_vuejs
Client scopes > client_roles_vuejs > mappers:
Name: roles
Mapper type: user client role
Client id: vue-web-app
Token claim name: roles
Claim json type: string

### Adicionar scope ao client:
Clients > vue-web-app > client scopes > default client scopes > client_roles_vuejs

### Pegar json de configuração, onde deve alimentar sua aplicações de frontend e backend
Clients > vue-web-app > installation > keycloak oidc json (no caso frontend/src/main.js)
Clients > node-microservice > installation > keycloak oidc json (backend/keycloak.json onde no server.js a lib já busca um
arquivo com o nome exato)

## Atenção ao usar com docker em desenvolvimento !
- Pois ao utilizar o json, deve substituir o dominio 'localhost' pelo ip
- do docker na máquina no meu caso '172.17.0.1'
- OU
- criando um dominio 'host.docker.internal' em /etc/hosts SEU_IP host.docker.internal

#### Mais possibilidade com Keycloak
- Criar banco de dados dedicado, ideal para produção
- Definir tempo, refresh token, outros tipos de autenticação/autorização, etc
- Adicionar itens ao token de access_token ou id_token ou nos dois(uma foto por exemplo não precisa existir no access), etc
- Ativar recuperar senha, se registrar, mudar username, verificar email, requer tls, remover sessao, log, exibir permissões que usuário terá acesso, etc
- Mudar formulario de cadastro, como campos, ou acessar via api, acesso via github, google, etc
- Remover todas as sessions que x usuário esta logado
- Possivel importar e exportar configurações de realm do Keycloak
- Em Client, e possivel ver os endpoints do OpenID connect endpoints ou SAML