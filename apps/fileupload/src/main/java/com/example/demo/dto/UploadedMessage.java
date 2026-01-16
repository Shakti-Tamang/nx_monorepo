package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UploadedMessage {
    
    @JsonProperty("filename")
    private String filename;
    
    @JsonProperty("imageType")
    private String imageType;
    
    @JsonProperty("mimetype")
    private String mimetype;
    
    @JsonProperty("size")
    private Long size;
    
    @JsonProperty("data")
    private String data;
}