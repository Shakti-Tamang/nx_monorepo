package com.example.demo.consumer;

import com.example.demo.config.RabbitMqConfig;
import com.example.demo.dto.RabbitMessageWrapper;
import com.example.demo.dto.UploadedMessage;
import com.example.demo.enums.ImageType;
import com.example.demo.model.Image;
import com.example.demo.service.SaveImage;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Base64;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RabbitMQConsumer {
    
    private static final Logger log = LoggerFactory.getLogger(RabbitMQConsumer.class);
    private final SaveImage saveImage;

    @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME)
    public void handleUpload(RabbitMessageWrapper wrapper) {
        log.info("Received message with pattern: {}", wrapper.getPattern());
        
        UploadedMessage message = wrapper.getData();
        processUpload(message);
    }
    
    private void processUpload(UploadedMessage message) {
        log.info("Processing upload for file: {}", message.getFilename());
        
        try {
            // Validate message
            if (message.getData() == null || message.getData().isEmpty()) {
                throw new RuntimeException("Empty image data received");
            }
            
            // Decode base64 data
            byte[] data = Base64.getDecoder().decode(message.getData());
            
            if (data.length == 0) {
                throw new RuntimeException("Decoded empty image data");
            }
            
            log.info("Processing image: {}, size: {} bytes, type: {}", 
                    message.getFilename(), data.length, message.getImageType());
            
            // Convert string to enum
            ImageType imageType;
            try {
                imageType = ImageType.valueOf(message.getImageType().toUpperCase());
            } catch (Exception e) {
                log.warn("Invalid image type: {}, defaulting to PRODUCT", message.getImageType());
                imageType = ImageType.PRODUCT;
            }
            
            // Create image entity
            Image image = Image.builder()
                    .type(imageType)
                    .build();

            // Save image
            Image savedImage = saveImage.uploadImage(
                    image,
                    data,
                    message.getFilename(),
                    message.getMimetype()
            );
            
            log.info("Image saved successfully with ID: {}", savedImage.getImageId());
            
        } catch (Exception e) {
            log.error("Failed to process upload message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process upload", e);
        }
    }
}