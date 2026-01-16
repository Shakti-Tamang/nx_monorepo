package com.example.demo.consumer;

import com.example.demo.config.RabbitMqConfig;
import com.example.demo.dto.ImageExistResponse;
import com.example.demo.dto.ImageExistanceMessage;
import com.example.demo.dto.UploadedMessage;
import com.example.demo.enums.ImageType;
import com.example.demo.model.Image;
import com.example.demo.service.SaveImage;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RabbitMQConsumer {

    private static final Logger log = LoggerFactory.getLogger(RabbitMQConsumer.class);
    private final SaveImage saveImage;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = RabbitMqConfig.UPLOAD_QUEUE)
    public void handleUpload(Message rawMessage) {
        try {
            String jsonString = new String(rawMessage.getBody());
            log.info("Raw message: {}", jsonString.substring(0, Math.min(200, jsonString.length())));

            // Parse outer wrapper
            JsonNode rootNode = objectMapper.readTree(jsonString);

            // Extract the actual data
            String actualData;
            if (rootNode.has("pattern") && rootNode.has("data")) {
                // NestJS wrapped format: {"pattern":"image.upload","data":"{...}"}
                actualData = rootNode.get("data").asText();
                log.info("Unwrapped NestJS message, actual data length: {}", actualData.length());
            } else {
                // Direct format: {"filename":"...","data":"..."}
                actualData = jsonString;
            }

            // Parse the actual message
            UploadedMessage message = objectMapper.readValue(actualData, UploadedMessage.class);
            log.info("Processing file: {}", message.getFilename());

            processUpload(message);

        } catch (Exception e) {
            log.error("Failed to process message: {}", e.getMessage(), e);
            throw new RuntimeException("Processing failed", e);
        }
    }

    private void processUpload(UploadedMessage message) {
        try {
            byte[] data = Base64.getDecoder().decode(message.getData());
            log.info("Decoded {} bytes", data.length);

            ImageType imageType = ImageType.valueOf(message.getImageType().toUpperCase());
            Image image = Image.builder().type(imageType).build();
            Image savedImage = saveImage.uploadImage(image, data, message.getFilename(), message.getMimetype());

            log.info("Upload complete: ID={}, URL={}", savedImage.getImageId(), savedImage.getImageUrl());

        } catch (Exception e) {
            log.error("Upload failed: {}", e.getMessage(), e);
            throw new RuntimeException("Upload failed", e);
        }
    }

    @RabbitListener(queues = RabbitMqConfig.EXIST_QUEUE)
    public ImageExistResponse handleExistence(Message rawMessage) {
        try {
            String jsonString = new String(rawMessage.getBody());
            log.info("Raw existence message: {}", jsonString);

            JsonNode rootNode = objectMapper.readTree(jsonString);

            // Extract actual data - handle NestJS wrapping
            String actualData;
            if (rootNode.has("pattern") && rootNode.has("data")) {
                // NestJS wrapped: {"pattern":"image.exists","data":"{\"imageIds\":[1,2,3]}"}
                actualData = rootNode.get("data").asText();
                log.info("Unwrapped NestJS message, actualData: {}", actualData);
            } else if (rootNode.has("data") && rootNode.get("data").isTextual()) {
                // Alternative wrap: {"data":"{\"imageIds\":[1,2,3]}"}
                actualData = rootNode.get("data").asText();
            } else {
                // Direct format: {"imageIds":[1,2,3]}
                actualData = jsonString;
            }

            // Parse the actual message
            ImageExistanceMessage message = objectMapper.readValue(actualData, ImageExistanceMessage.class);
            log.info("Checking existence for IDs: {}", message.getImageIds());

            List<Image> images = saveImage.findImageByIds(message.getImageIds());
            boolean exists = images.size() == message.getImageIds().size();

            log.info("Image check result: {} (found {}/{})", exists, images.size(), message.getImageIds().size());

            return new ImageExistResponse(exists);

        } catch (Exception e) {
            log.error("Image check failed: {}", e.getMessage(), e);
            return new ImageExistResponse(false);
        }
    }
}