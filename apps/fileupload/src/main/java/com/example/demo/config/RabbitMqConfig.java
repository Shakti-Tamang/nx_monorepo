package com.example.demo.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMqConfig {
    public static final String QUEUE_NAME = "File_Que";
    public static final String EXCHANGE_NAME = "upload_Exchange";
    public static final String ROUTING_KEY = "routing.key";
    
    @Bean
    public Queue queue() {
        return new Queue(QUEUE_NAME, true);
    }
    
    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }
    
    @Bean
    public Binding binding(Queue queue, DirectExchange exchange) { 
        return BindingBuilder
                .bind(queue)
                .to(exchange)
                .with(ROUTING_KEY); 
    }
}