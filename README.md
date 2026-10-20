# Mobile_BarberShop

## Recuperação de senha por Gmail

1. No diretório `backend`, instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e configure `GMAIL_USER` com o endereço Gmail remetente e `GMAIL_APP_PASSWORD` com uma senha de app Google. Não use a senha normal da conta. A verificação em duas etapas precisa estar ativa para criar uma senha de app.
3. Inicie o backend com `npm start`. A conexão MySQL deve estar configurada em `backend/db.js` e a tabela `reset_tokens` deve existir (ela está no arquivo `BarberShop.sql`).
4. Como o esquema de links do aplicativo foi alterado para `barbershop://`, reinicie/recompile o app Expo para que o sistema operacional reconheça o link. O link recebido por e-mail abre `barbershop://resetar-senha?token=...`.
5. Para Android em emulador, o app usa `http://10.0.2.2:3000`. Em um celular físico, altere `API_URL` em `mobile/barbershop/App.js` para o IP local do computador que executa o backend.

O token é aleatório, armazenado no banco, expira em 30 minutos e só pode ser usado uma vez. O arquivo `.env` contém credenciais e não deve ser enviado ao Git.
