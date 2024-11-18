package com.dailycodework.dreamshops.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product")
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 100)
    private String company;

    @Column(length = 255)
    private String img;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    private Integer star;

    @Column(name = "rate_count")
    private Integer rateCount;

    @Column(name = "promo_name", length = 50)
    private String promoName;

    @Column(name = "promo_value", length = 50)
    private String promoValue;

    @Column(length = 100)
    private String screen;

    @Column(length = 50)
    private String os;

    @Column(length = 50)
    private String camara;

    @Column(name = "camara_front", length = 50)
    private String camaraFront;

    @Column(length = 100)
    private String cpu;

    @Column(length = 20)
    private String ram;

    @Column(length = 20)
    private String rom;

    @Column(name = "micro_usb", length = 100)
    private String microUsb;

    @Column(length = 50)
    private String battery;

    @Column(length = 20, unique = true, nullable = false)
    private String masp;
}
