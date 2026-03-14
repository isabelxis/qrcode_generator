# QR Code Generator

A Spring Boot application that generates QR codes from text input and stores them on AWS S3. Built with a clean architecture using the ports and adapters pattern.

https://isabelxis.github.io/qrcode_generator/

## Features

- **Generate QR Codes**: Create QR codes from any text input
- **Cloud Storage**: Automatically upload generated QR codes to AWS S3
- **RESTful API**: Simple HTTP endpoint for QR code generation
- **UUID-based Naming**: Unique file naming for all generated QR codes
- **Containerized**: Docker support for easy deployment

## Tech Stack

- **Java 17**: Modern Java runtime
- **Spring Boot 4.0.0**: Framework for building production-ready applications
- **Google ZXing 3.5.2**: QR code generation library
- **AWS SDK 2.24.12**: AWS S3 integration
- **Maven**: Build and dependency management
- **Docker**: Containerization

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- AWS Account with S3 bucket access
- AWS credentials configured or provided via environment variables

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qrcode_generator
   ```

2. **Build the project**
   ```bash
   mvn clean package
   ```

3. **Run the application**
   ```bash
   java -jar target/qrcode.generator-0.0.1-SNAPSHOT.jar
   ```

## Configuration

### Environment Variables

Configure the following environment variables before running the application:

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_REGION` | AWS region for S3 bucket | `us-east-2` |
| `AWS_BUCKET_NAME` | S3 bucket name | `my-qrcode-bucket` |
| `AWS_ACCESS_KEY_ID` | AWS access key (if not using IAM roles) | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key (if not using IAM roles) | - |

### application.properties

The application is configured via `src/main/resources/application.properties`:

```properties
spring.application.name=qrcode.generator
aws.s3.region=${AWS_REGION}
aws.s3.bucket-name=${AWS_BUCKET_NAME}
```

## Usage

### API Endpoint

**Generate QR Code**

- **URL**: `POST /qrcode`
- **Content-Type**: `application/json`
- **Port**: `8080` (default)

**Request Example**

```bash
curl -X POST http://localhost:8080/qrcode \
  -H "Content-Type: application/json" \
  -d '{"text":"https://example.com"}'
```

**Request Body**

```json
{
  "text": "https://example.com"
}
```

**Response Example**

```json
{
  "url": "http://my-qrcode-bucket.s3.us-east-2.amazonaws.com/550e8400-e29b-41d4-a716-446655440000"
}
```

**Success Response**
- **Status Code**: `200 OK`
- **Body**: JSON object containing the S3 URL of the generated QR code

**Error Response**
- **Status Code**: `500 Internal Server Error`
- When QR code generation or upload fails

## Project Structure

```
qrcode_generator/
├── src/
│   ├── main/
│   │   ├── java/com/isabelxavier/qrcode/generator/
│   │   │   ├── Application.java                 # Spring Boot entry point
│   │   │   ├── controller/
│   │   │   │   └── QrCodeController.java        # REST API endpoint
│   │   │   ├── service/
│   │   │   │   └── QrCodeGeneratorService.java  # Core business logic
│   │   │   ├── dto/
│   │   │   │   ├── QrCodeGenerateRequest.java   # Request DTO
│   │   │   │   └── QrCodeGenerateResponse.java  # Response DTO
│   │   │   ├── ports/
│   │   │   │   └── StoragePort.java             # Storage abstraction
│   │   │   └── infrastructure/
│   │   │       └── S3StorageAdapter.java        # AWS S3 implementation
│   │   └── resources/
│   │       └── application.properties           # Configuration
│   └── test/
│       └── java/...                             # Tests
├── Dockerfile                                  # Docker configuration
├── pom.xml                                     # Maven configuration
└── README.md                                   # This file
```

## Architecture

This project follows a **Clean Architecture** pattern with clear separation of concerns:

- **Controller Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic for QR code generation
- **Port (Interface)**: Defines the storage contract (`StoragePort`)
- **Adapter (Implementation)**: Implements storage using AWS S3 (`S3StorageAdapter`)
- **DTOs**: Data transfer objects for request/response handling

### Flow Diagram

```
Request → Controller → Service → Port → Adapter (S3) → AWS S3
                          ↓
                    QR Code Generation
                          ↓
Response ← QrCodeGenerateResponse ← S3 URL
```

## Docker Setup

### Build Docker Image

```bash
docker build \
  --build-arg AWS_ACCESS_KEY_ID=<your-access-key> \
  --build-arg AWS_SECRET_ACCESS_KEY=<your-secret-key> \
  -t qrcode-generator:latest .
```

### Run Docker Container

```bash
docker run -e AWS_REGION=us-east-2 \
           -e AWS_BUCKET_NAME=my-qrcode-bucket \
           -p 8080:8080 \
           qrcode-generator:latest
```

### Docker Compose (Optional)

Create a `docker-compose.yml` file:

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

Run with:
```bash
docker-compose up
```

## Development

### Build

```bash
mvn clean package
```

### Run Tests

```bash
mvn test
```

### Skip Tests During Build

```bash
mvn clean package -DskipTests
```

## Dependencies

Key dependencies included in the project:

- `spring-boot-starter-webmvc`: Web framework
- `spring-boot-devtools`: Development tools
- `spring-boot-starter-webmvc-test`: Testing framework
- `com.google.zxing:core`: QR code generation
- `com.google.zxing:javase`: Java SE support for ZXing
- `software.amazon.awssdk:s3`: AWS S3 client

## Troubleshooting

### AWS Connection Issues

1. **Ensure AWS credentials are properly configured**
   - Export environment variables or use AWS CLI configuration
   - Check IAM permissions for S3 bucket access

2. **Verify bucket exists and is accessible**
   ```bash
   aws s3 ls s3://your-bucket-name
   ```

3. **Check AWS region matches bucket location**

### Build Issues

1. **Java version mismatch**
   - Ensure you're using Java 17+
   - Check `java -version`

2. **Maven issues**
   - Clear local repository: `mvn clean`
   - Force update dependencies: `mvn -U clean install`

## Future Enhancements

- Different QR code sizes and error correction levels
- Batch QR code generation
- QR code download endpoint
- Statistics and analytics
- Custom branding options
- Rate limiting and authentication

## License

This project is provided as-is for educational and commercial use.

## Author

Isabel Xavier

## Support

For issues or questions, please open an issue in the repository.
