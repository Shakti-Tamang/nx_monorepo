package com.example.demo.dto;

import com.example.demo.enums.ImageType;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
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
    private String data; // Base64
    
    // Add getter for ImageType enum
    public ImageType getImageTypeEnum() {
        try {
            return ImageType.valueOf(this.imageType.toUpperCase());
        } catch (Exception e) {
            return ImageType.PRODUCT;
        }
    }
}