package com.dailycodework.dreamshops.request;

import com.dailycodework.dreamshops.model.Category;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddProductRequest {

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Company cannot be blank")
    private String company;

    @NotBlank(message = "Image URL cannot be blank")
    private String img;

    @NotNull(message = "Price cannot be null")
    private BigDecimal price;

    private int star; // Default 0
    private int rateCount; // Default 0

    @NotNull(message = "Promo details cannot be null")
    private Promo promo;

    @NotNull(message = "Detail information cannot be null")
    private Detail detail;

    @NotBlank(message = "Product code (masp) cannot be blank")
    private String masp;

    // Nested Promo class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Promo {
        @NotBlank(message = "Promo name cannot be blank")
        private String name;

        @NotBlank(message = "Promo value cannot be blank")
        private String value;
    }

    // Nested Detail class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Detail {
        @NotBlank(message = "Screen details cannot be blank")
        private String screen;

        @NotBlank(message = "Operating system cannot be blank")
        private String os;

        @NotBlank(message = "Camera details cannot be blank")
        private String camara;

        @NotBlank(message = "Front camera details cannot be blank")
        private String camaraFront;

        @NotBlank(message = "CPU details cannot be blank")
        private String cpu;

        @NotBlank(message = "RAM details cannot be blank")
        private String ram;

        @NotBlank(message = "ROM details cannot be blank")
        private String rom;

        @NotBlank(message = "MicroUSB details cannot be blank")
        private String microUSB;

        @NotBlank(message = "Battery details cannot be blank")
        private String battery;
    }
}
