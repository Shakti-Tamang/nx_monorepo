package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RabbitMessageWrapper {
    @JsonProperty("pattern")
    private String pattern;
    
    @JsonProperty("data")
    private UploadedMessage data;
}