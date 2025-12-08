package com.isabelxavier.qrcode.generator.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import com.isabelxavier.qrcode.generator.dto.QrCodeGenerateResponse;
import com.isabelxavier.qrcode.generator.ports.StoragePort;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.UUID;

@Service
public class QrCodeGeneratorService {

    private final StoragePort storage;

    public QrCodeGeneratorService(StoragePort storage) {
        this.storage = storage;
    }

    public QrCodeGenerateResponse generateAndUploadQrCode(String text) throws WriterException, IOException {

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 200,200);

        ByteArrayOutputStream pngOPStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOPStream);
        byte[] pngQrCodeDt = pngOPStream.toByteArray();

        String url = storage.uploadFile(pngQrCodeDt, UUID.randomUUID().toString(),"image/png");

        return new QrCodeGenerateResponse(url);
    }
}
