package com.example.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.model.Image;
import com.example.demo.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class SaveImageImpl implements SaveImage {
    
    private static final Logger log = LoggerFactory.getLogger(SaveImageImpl.class);
    private final Cloudinary cloudinary;
    private final ImageRepository imageRepository;

    @Override
    public Image uploadImage(Image image, byte[] data, String filename, String mimetype) {
        log.info("Uploading image to Cloudinary: {}, size: {} bytes", filename, data.length);
        
        Image savedImage;
        try {
            // Upload to Cloudinary
            Map<?, ?> result = cloudinary.uploader().upload(data, ObjectUtils.asMap(
                "resource_type", "image",
                "folder", "uploads",
                "public_id", filename.replaceAll("[^a-zA-Z0-9._-]", "_"), 
                "overwrite", true
            ));
            
            log.info("Cloudinary upload successful for: {}", filename);
            
            String url = (String) result.get("secure_url");
            String publicId = (String) result.get("public_id");
            
            image.setImageUrl(url);
            image.setPublicId(publicId);
            
            // Save to database
            savedImage = imageRepository.save(image);
            log.info("Image saved to database with ID: {}", savedImage.getImageId());
            
        } catch (Exception e) {
            log.error("Failed to upload image '{}' to Cloudinary: {}", filename, e.getMessage(), e);
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }

        return savedImage;
    }
}