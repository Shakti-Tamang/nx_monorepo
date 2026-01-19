package com.example.demo.config;

import java.rmi.Remote;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class RabbitMqConfig {

    // Remote Procedure Call (RPC) is a protocol that lets a program on one computer
 // The comment `// Remote Procedure Call (RPC) is a protocol that lets a program on one computer call
 // a function or procedure on another computer as if it were a local call` is providing an explanation
 // or description of what Remote Procedure Call (RPC) is. It is a protocol that allows a program
 // running on one computer to execute code on a remote server as if it were a local function call.
 // This comment is meant to provide context or information about RPC in the codebase.
    // call a function or procedure on another computer as if it were a local call

    public static final String UPLOAD_QUEUE = "image.upload.queue";
    public static final String EXIST_QUEUE = "image.exist.queue";
    public static final String FETCH_QUEUE = "image.fetch.queue";

    public static final String UPLOAD_ROUTING_KEY = "image.upload";
    public static final String EXIST_ROUTING_KEY = "image.exists";
    public static final String FETCH_ROUTING_KEY = "image.fetch";

    public static final String EXCHANGE_NAME = "upload_Exchange";

    // ===== Queues =====
    @Bean
    public Queue uploadQueue() {
        return new Queue(UPLOAD_QUEUE, true);
    }

    @Bean
    public Queue existQueue() {
        return new Queue(EXIST_QUEUE, true);
    }

    @Bean
    public Queue fetchQueue() { // Fixed: Bean name matches parameter
        return new Queue(FETCH_QUEUE, true);
    }

    // ===== Exchange =====
    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    // ===== Bindings =====
    @Bean
    public Binding uploadBinding(Queue uploadQueue, DirectExchange exchange) {
        return BindingBuilder.bind(uploadQueue).to(exchange).with(UPLOAD_ROUTING_KEY);
    }

    @Bean
    public Binding existBinding(Queue existQueue, DirectExchange exchange) {
        return BindingBuilder.bind(existQueue).to(exchange).with(EXIST_ROUTING_KEY);
    }

    @Bean
    public Binding fetchBinding(Queue fetchQueue, DirectExchange exchange) { // Fixed
        return BindingBuilder.bind(fetchQueue).to(exchange).with(FETCH_ROUTING_KEY);
    }

    // ===== Message Converter =====
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return objectMapper;
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter(ObjectMapper objectMapper) {
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    // ===== RabbitTemplate =====
    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory connectionFactory,
            Jackson2JsonMessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(converter);
        return template;
    }

    // ===== Listener Factory =====
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            Jackson2JsonMessageConverter converter) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(converter);
        factory.setConcurrentConsumers(2);
        factory.setMaxConcurrentConsumers(10);
        factory.setPrefetchCount(10);
        factory.setDefaultRequeueRejected(false);
        return factory;
    }
}