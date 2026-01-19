package com.example.demo.dto;
import com.example.demo.model.Image;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageFetchResponse {
    private List<Image> images;
    private int count;
    private boolean success;
}
