# Gerador de QR Code

Uma aplicação Spring Boot que gera QR codes a partir de texto e os armazena no AWS S3. Construída com arquitetura limpa utilizando o padrão ports and adapters.

https://isabelxis.github.io/qrcode_generator/

**README Frontend**: https://github.com/isabelxis/qrcode_generator/blob/main/frontend/README.md#frontend--qr-code-generator

## Funcionalidades

- **Geração de QR Codes**: Crie QR codes a partir de qualquer texto
- **Armazenamento em Nuvem**: Upload automático dos QR codes gerados para o AWS S3
- **API RESTful**: Endpoint HTTP simples para geração de QR codes
- **Nomenclatura por UUID**: Nomes únicos para todos os arquivos gerados
- **Conteinerizado**: Suporte a Docker para facilitar o deploy

## Tecnologias

- **Java 17**: Runtime moderno do Java
- **Spring Boot 4.0.0**: Framework para aplicações prontas para produção
- **Google ZXing 3.5.2**: Biblioteca de geração de QR codes
- **AWS SDK 2.24.12**: Integração com AWS S3
- **Maven**: Gerenciamento de build e dependências
- **Docker**: Conteinerização

## Pré-requisitos

- Java 17 ou superior
- Maven 3.6 ou superior
- Conta AWS com acesso a um bucket S3
- Credenciais AWS configuradas ou fornecidas via variáveis de ambiente

## Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd qrcode_generator
   ```

2. **Build do projeto**
   ```bash
   mvn clean package
   ```

3. **Execute a aplicação**
   ```bash
   java -jar target/qrcode.generator-0.0.1-SNAPSHOT.jar
   ```

## Configuração

### Variáveis de Ambiente

Configure as seguintes variáveis de ambiente antes de executar a aplicação:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `AWS_REGION` | Região AWS do bucket S3 | `us-east-2` |
| `AWS_BUCKET_NAME` | Nome do bucket S3 | `my-qrcode-bucket` |
| `AWS_ACCESS_KEY_ID` | Chave de acesso AWS (se não usar IAM roles) | - |
| `AWS_SECRET_ACCESS_KEY` | Chave secreta AWS (se não usar IAM roles) | - |

### application.properties

A aplicação é configurada via `src/main/resources/application.properties`:

```properties
spring.application.name=qrcode.generator
aws.s3.region=${AWS_REGION}
aws.s3.bucket-name=${AWS_BUCKET_NAME}
```

## Uso

### Endpoint da API

**Gerar QR Code**

- **URL**: `POST /qrcode`
- **Content-Type**: `application/json`
- **Porta**: `8080` (padrão)

**Exemplo de Requisição**

```bash
curl -X POST http://localhost:8080/qrcode \
  -H "Content-Type: application/json" \
  -d '{"text":"https://example.com"}'
```

**Corpo da Requisição**

```json
{
  "text": "https://example.com"
}
```

**Exemplo de Resposta**

```json
{
  "url": "http://my-qrcode-bucket.s3.us-east-2.amazonaws.com/550e8400-e29b-41d4-a716-446655440000"
}
```

**Resposta de Sucesso**
- **Código de Status**: `200 OK`
- **Corpo**: Objeto JSON contendo a URL do QR code no S3

**Resposta de Erro**
- **Código de Status**: `500 Internal Server Error`
- Quando a geração ou upload do QR code falha

## Estrutura do Projeto

```
qrcode_generator/
├── src/
│   ├── main/
│   │   ├── java/com/isabelxavier/qrcode/generator/
│   │   │   ├── Application.java                 # Ponto de entrada Spring Boot
│   │   │   ├── controller/
│   │   │   │   └── QrCodeController.java        # Endpoint da API REST
│   │   │   ├── service/
│   │   │   │   └── QrCodeGeneratorService.java  # Lógica de negócio principal
│   │   │   ├── dto/
│   │   │   │   ├── QrCodeGenerateRequest.java   # DTO de requisição
│   │   │   │   └── QrCodeGenerateResponse.java  # DTO de resposta
│   │   │   ├── ports/
│   │   │   │   └── StoragePort.java             # Abstração de armazenamento
│   │   │   └── infrastructure/
│   │   │       └── S3StorageAdapter.java        # Implementação AWS S3
│   │   └── resources/
│   │       └── application.properties           # Configuração
│   └── test/
│       └── java/...                             # Testes
├── Dockerfile                                  # Configuração Docker
├── pom.xml                                     # Configuração Maven
└── README.md                                   # Este arquivo
```

## Arquitetura

Este projeto segue o padrão de **Arquitetura Limpa** com clara separação de responsabilidades:

- **Camada Controller**: Trata requisições e respostas HTTP
- **Camada Service**: Contém a lógica de negócio para geração de QR codes
- **Port (Interface)**: Define o contrato de armazenamento (`StoragePort`)
- **Adapter (Implementação)**: Implementa o armazenamento usando AWS S3 (`S3StorageAdapter`)
- **DTOs**: Objetos de transferência de dados para requisições e respostas

### Fluxo da Aplicação

```
Requisição → Controller → Service → Port → Adapter (S3) → AWS S3
                              ↓
                     Geração do QR Code
                              ↓
Resposta ← QrCodeGenerateResponse ← URL do S3
```

## Configuração Docker

### Build da Imagem Docker

```bash
docker build \
  --build-arg AWS_ACCESS_KEY_ID=<sua-chave-de-acesso> \
  --build-arg AWS_SECRET_ACCESS_KEY=<sua-chave-secreta> \
  -t qrcode-generator:latest .
```

### Executar o Container Docker

```bash
docker run -e AWS_REGION=us-east-2 \
           -e AWS_BUCKET_NAME=my-qrcode-bucket \
           -p 8080:8080 \
           qrcode-generator:latest
```

### Docker Compose (Opcional)

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3.8'
services:
  qrcode-generator:
    build: .
    ports:
      - "8080:8080"
    environment:
      AWS_REGION: us-east-2
      AWS_BUCKET_NAME: my-qrcode-bucket
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
```

Execute com:
```bash
docker-compose up
```

## Desenvolvimento

### Build

```bash
mvn clean package
```

### Executar Testes

```bash
mvn test
```

### Pular Testes Durante o Build

```bash
mvn clean package -DskipTests
```

## Dependências

Principais dependências do projeto:

- `spring-boot-starter-webmvc`: Framework web
- `spring-boot-devtools`: Ferramentas de desenvolvimento
- `spring-boot-starter-webmvc-test`: Framework de testes
- `com.google.zxing:core`: Geração de QR codes
- `com.google.zxing:javase`: Suporte Java SE para ZXing
- `software.amazon.awssdk:s3`: Cliente AWS S3

## Solução de Problemas

### Problemas de Conexão com a AWS

1. **Verifique se as credenciais AWS estão configuradas corretamente**
   - Exporte as variáveis de ambiente ou use a configuração do AWS CLI
   - Verifique as permissões IAM para acesso ao bucket S3

2. **Verifique se o bucket existe e está acessível**
   ```bash
   aws s3 ls s3://nome-do-seu-bucket
   ```

3. **Confirme se a região AWS corresponde à localização do bucket**

### Problemas de Build

1. **Versão do Java incompatível**
   - Certifique-se de usar Java 17+
   - Verifique com `java -version`

2. **Problemas com Maven**
   - Limpe o repositório local: `mvn clean`
   - Force a atualização das dependências: `mvn -U clean install`

## Melhorias Futuras

- Diferentes tamanhos de QR code e níveis de correção de erros
- Geração de QR codes em lote
- Endpoint para download de QR codes
- Estatísticas e analytics
- Opções de personalização visual
- Rate limiting e autenticação

## Licença

Este projeto é fornecido como está para uso educacional e comercial.

## Autora

Isabel Xavier

## Suporte

Para dúvidas ou problemas, por favor abra uma issue no repositório.
