package com.example.demo.service;

import com.example.demo.model.Image;

public interface SaveImage {

    public Image uploadImage(Image image, byte[] data, String filename, String mimetype);

}
