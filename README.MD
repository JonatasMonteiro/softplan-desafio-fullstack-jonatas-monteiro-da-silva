# Desafio implementador fullstack

Seguem abaixo as instruções para o uso do sistema desenvolvido:

### Instruções para rodar o projeto - Backend
- Na pasta "backend" rode o comando no terminal(Linux/Mac):
	- ./mvnw spring-boot:run
- Na pasta "backend" rode o comando no CMD(Windows):
	- mvnw spring-boot:run

### Instruções para rodar o projeto - Frontend
- Na pasta "frontend" rode os comandos no terminal ou CMD:
	- npm install
	- npm start

### Instruções para testar o projeto
- Na pasta "backend" rode o comando no terminal(Linux/Mac):
	- ./mvnw test
- Na pasta "backend" rode o comando no CMD(Windows):
	- mvnw test

### Instruções para as funcionalidades do projeto
#### Logar como admin
- Na página inicial, preencha o username(admin) e a senha(1234)
- Clique no botão "Login"

#### Logar como usuário triador
- Na página inicial, preencha o username(triador) e a senha(1234)
- Clique no botão "Login"

#### Logar como usuário finalizador
- Na página inicial, preencha o username(finalizador) e a senha(1234)
- Clique no botão "Login"

#### Na página de usuarios(visão de administrador)
- Para visualizar informações de um usuário:
	- Clique no símbolo de usuário(primeiro botão) na coluna "Ações" da tabela, na linha do usuário que se quer ver
- Para editar informações de um usuário:
	- Clique no símbolo de um lápis(segundo botão) na coluna "Ações" da tabela, na linha do usuário que se quer editar
		- Preencha os campos
		- Se quiser cancelar a edição, clique no botão Voltar
		- Para submeter a edição, clique em Editar Usuário
- Para deletar um usuário:
	- Clique no símbolo de uma lata de lixo(terceiro botão) na coluna "Ações" da tabela, na linha do usuário que quer deletar
- Para criar um novo usuário:
	- Clique no botão Criar Usuário que fica debaixo da tabela
		- Preencha os campos
		- Se quiser cancelar a criação, clique no botão Voltar
		- Para submeter a criação, clique em Criar Usuário

#### Na página de processos(visão de usuário triador)
- Para visualizar os dados de um processo:
	- Clique no símbolo de uma lupa na coluna Ações da tabela, na linha do processo que quer visualizar
- Para criar um novo processo:
	- Clique no botão Criar Processo que está abaixo da tabela
		- Preencha os dados
		- Clique no botão Voltar se quiser cancelar a criação
		- Clique submeter a criação, clique em Criar Processo
- Para requisitar um usuário a dar um parecer:
	- Clique no botão Requisitar Parecer que está abaixo da tabela do lado direito
		- Selecione qual processo e qual o usuario para dar o parecer
		- Se quiser desistir da ação, clique no botão Voltar
		- Se quiser prosseguir, clique em Solicitar Parecer

#### Na pagina de processos a receberem parecer(visão de usuario finalizador)
- Para dar um parecer em um processo:
	- Clique no botão com símbolo de lápis
		-Preencha o campo Parecer
		- Se quiser desistir, clique em Voltar
		- Se quiser prosseguir, clique em Dar Parecer

#### Para deslogar
- Clique no botão LogOut que fica no canto superior direto da tela