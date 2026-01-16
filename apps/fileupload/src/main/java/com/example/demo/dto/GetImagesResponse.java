package com.example.demo.dto;

import com.example.demo.model.Image;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetImagesResponse {
    
    @JsonProperty("images")
    private List<Image> images;
    
    @JsonProperty("success")
    private boolean success;
    
    @JsonProperty("count")
    private int count;
}