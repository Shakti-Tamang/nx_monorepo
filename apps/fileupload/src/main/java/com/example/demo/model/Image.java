package com.example.demo.model;

import com.example.demo.enums.ImageType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class Image {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)

    Long imageId;


    String imageUrl;

    Long publicId;

    @Enumerated(EnumType.STRING)

    private ImageType type;

}
