# Frontend — QR Code Generator

Frontend estatico para geracao de QR Code consumindo o backend em `POST /qrcode`.

## Implementacao atual

- Interface centralizada com card e layout limpo
- Campo para texto/URL e botao de geracao
- Exibicao do QR Code gerado com link para abertura da imagem
- Tratamento de erro de rede/API no navegador
- Resolucao automatica da API com fallback:
  - `http://<host-da-pagina>:8080/qrcode`
  - `http://localhost:8080/qrcode`
  - `http://127.0.0.1:8080/qrcode`

## Como executar

1. Suba o backend na porta `8080`.
2. Inicie o frontend:

```bash
cd frontend
npx serve .
```

3. Acesse `http://localhost:3000`.

## Arquivos principais

- `index.html`: estrutura da pagina
- `styles.css`: estilos do layout
- `app.js`: integracao com a API e renderizacao do resultado
