package com.example.demo.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory; // ✅ correct
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class RabbitMqConfig {

    public static final String UPLOAD_QUEUE = "image.upload.queue";
    public static final String EXIST_QUEUE = "image.exist.queue";
    public static final String FETCH_QUEUE = "image.fetch.queue";
    public static final String UPLOAD_ROUTING_KEY = "image.upload";
    public static final String EXIST_ROUTING_KEY = "image.exists";
    public static final String FETCH_ROUTING_KEY = "image.fetch";
    public static final String EXCHANGE_NAME = "upload_Exchange";

    @Bean
    public Queue uploadQueue() {
        return new Queue(UPLOAD_QUEUE, true);
    }

    @Bean
    public Queue existQueue() {
        return new Queue(EXIST_QUEUE, true);
    }
    
    @Bean
    public Queue fetchImage() {
        return new Queue(FETCH_QUEUE, true);
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding uploadBinding(Queue uploadQueue, DirectExchange exchange) {
        return BindingBuilder.bind(uploadQueue).to(exchange).with(UPLOAD_ROUTING_KEY);
    }

    @Bean
    public Binding existBinding(Queue existQueue, DirectExchange exchange) {
        return BindingBuilder.bind(existQueue).to(exchange).with(EXIST_ROUTING_KEY);
    }

        @Bean
    public Binding fetchBinding(Queue fetchQueue, DirectExchange exchange) {
        return BindingBuilder.bind(fetchQueue).to(exchange).with(FETCH_ROUTING_KEY);
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory); 
        factory.setMessageConverter(jackson2JsonMessageConverter());
        return factory;
    }
}
