package com.example.demo.service;

import java.util.List;
import java.util.Map;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.model.Image;
import com.example.demo.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SaveImageImpl implements SaveImage {

    private static final Logger log = LoggerFactory.getLogger(SaveImageImpl.class);
    private final Cloudinary cloudinary;
    private final ImageRepository imageRepository;

    @Override
    public Image uploadImage(Image image, byte[] data, String filename, String mimetype) {
        try {
            log.info("Uploading to Cloudinary: {}", filename);

            // Upload to Cloudinary
            Map<?, ?> result = cloudinary.uploader().upload(data, ObjectUtils.asMap(
                    "resource_type", "image",
                    "folder", "uploads"
            ));

            // Set image properties
            image.setImageUrl((String) result.get("secure_url"));
            image.setPublicId((String) result.get("public_id"));

            // Save to database
            return imageRepository.save(image);

        } catch (Exception e) {
            log.error("Upload failed for {}: {}", filename, e.getMessage());
            throw new RuntimeException("Upload failed", e);
        }
    }

    @Override
    public List<Image> findImageByIds(List<Long> ids) {
        return imageRepository.findByImageIds(ids);
    }
}