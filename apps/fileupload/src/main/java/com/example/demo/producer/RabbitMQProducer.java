package com.example.demo.producer;

import org.springframework.stereotype.Service;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import com.example.demo.config.RabbitMqConfig;

@Service
public class RabbitMQProducer {

    private final RabbitTemplate rabbitTemplate;

    public RabbitMQProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    // Send Upload Message
    public void sendUploadMessage(Object message) {
        rabbitTemplate.convertAndSend(
                RabbitMqConfig.EXCHANGE_NAME,
                RabbitMqConfig.UPLOAD_ROUTING_KEY,
                message
        );
        System.out.println("Sent upload message: " + message);
    }

    // Send Existence Check Message
    public void sendExistenceMessage(Object message) {
        rabbitTemplate.convertAndSend(
                RabbitMqConfig.EXCHANGE_NAME,
                RabbitMqConfig.EXIST_ROUTING_KEY,
                message
        );
        System.out.println("Sent existence check message: " + message);
    }
}
