package com.dailycodework.dreamshops.service.product;

import com.dailycodework.dreamshops.dto.ImageDto;
import com.dailycodework.dreamshops.dto.ProductDto;
import com.dailycodework.dreamshops.exceptions.AlreadyExistsException;
import com.dailycodework.dreamshops.exceptions.ResourceNotFoundException;
import com.dailycodework.dreamshops.model.*;
import com.dailycodework.dreamshops.repository.*;
import com.dailycodework.dreamshops.request.AddProductRequest;
import com.dailycodework.dreamshops.request.ProductUpdateRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final ImageRepository imageRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public Product addProduct(AddProductRequest request) {
        if (productExists(request.getMasp())) {
            throw new AlreadyExistsException(request.getMasp() + " already exists, you may update this product instead!");
        }
        return productRepository.save(createProduct(request));
    }

//    @Override
//    public Product findByName(String name) {
//        return productRepository.fin
//    }

    private boolean productExists(String masp) {
        return productRepository.existByMaSP(masp);
    }

    private Product createProduct(AddProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setCompany(request.getCompany());
        product.setImg(request.getImg());
        product.setPrice(request.getPrice()); // Convert price to BigDecimal
        product.setStar(request.getStar());
        product.setRateCount(request.getRateCount());

        // Promo details
        if (request.getPromo() != null) {
            product.setPromoName(request.getPromo().getName());
            product.setPromoValue(request.getPromo().getValue());
        }

        // Detail information
        if (request.getDetail() != null) {
            product.setScreen(request.getDetail().getScreen());
            product.setOs(request.getDetail().getOs());
            product.setCamara(request.getDetail().getCamara());
            product.setCamaraFront(request.getDetail().getCamaraFront());
            product.setCpu(request.getDetail().getCpu());
            product.setRam(request.getDetail().getRam());
            product.setRom(request.getDetail().getRom());
            product.setMicroUsb(request.getDetail().getMicroUSB());
            product.setBattery(request.getDetail().getBattery());
        }

        product.setMasp(request.getMasp());
        return product;
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
    }

    @Override
    public void deleteProductById(Long id) {
//        List<CartItem> cartItems = cartItemRepository.findByProductId(id);
//        List<OrderItem> orderItems = orderItemRepository.findByProductId(id);
//        productRepository.findById(id)
//                .ifPresentOrElse(product -> {
//                    // Functional approach for category removal
//                    Optional.ofNullable(product.getCategory())
//                            .ifPresent(category -> category.getProducts().remove(product));
//                    product.setCategory(null);
//
//                    // Functional approach for updating cart items
//                    cartItems.stream()
//                            .peek(cartItem -> cartItem.setProduct(null))
//                            .peek(CartItem::setTotalPrice)
//                            .forEach(cartItemRepository::save);
//
//                    // Functional approach for updating order items
//                    orderItems.stream()
//                            .peek(orderItem -> orderItem.setProduct(null))
//                            .forEach(orderItemRepository::save);
//
//                    productRepository.delete(product);
//                }, () -> {
//                    throw new EntityNotFoundException("Product not found!");
//                });
    }

    @Override
    public Product updateProduct(ProductUpdateRequest request, Long productId) {
        return productRepository.findById(productId)
                .map(existingProduct -> updateExistingProduct(existingProduct, request))
                .map(productRepository::save)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
    }

    private Product updateExistingProduct(Product existingProduct, ProductUpdateRequest request) {
        existingProduct.setName(request.getName());
        existingProduct.setCompany(request.getCompany());
        existingProduct.setImg(request.getImg());
        existingProduct.setPrice(request.getPrice()); // Convert price to BigDecimal
        existingProduct.setStar(request.getStar());
        existingProduct.setRateCount(request.getRateCount());

        // Promo details
        if (request.getPromo() != null) {
            existingProduct.setPromoName(request.getPromo().getName());
            existingProduct.setPromoValue(request.getPromo().getValue());
        }

        // Detail information
        if (request.getDetail() != null) {
            existingProduct.setScreen(request.getDetail().getScreen());
            existingProduct.setOs(request.getDetail().getOs());
            existingProduct.setCamara(request.getDetail().getCamara());
            existingProduct.setCamaraFront(request.getDetail().getCamaraFront());
            existingProduct.setCpu(request.getDetail().getCpu());
            existingProduct.setRam(request.getDetail().getRam());
            existingProduct.setRom(request.getDetail().getRom());
            existingProduct.setMicroUsb(request.getDetail().getMicroUSB());
            existingProduct.setBattery(request.getDetail().getBattery());
        }

        existingProduct.setMasp(request.getMasp());
        return existingProduct;

    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryName(category);
    }

    @Override
    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }


    @Override
    public List<Product> searchProduct(String search) {
        return this.productRepository.searchProduct(search);
    }

    @Override
    public List<Product> getProductsByName(String name) {
        return productRepository.findByName(name);
    }


    @Override
    public List<ProductDto> getConvertedProducts(List<Product> products) {
        return products.stream().map(this::convertToDto).toList();
    }

    @Override
    public ProductDto convertToDto(Product product) {
        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        List<Image> images = imageRepository.findByProductId(product.getId());
        List<ImageDto> imageDtos = images.stream()
                .map(image -> modelMapper.map(image, ImageDto.class))
                .toList();
        productDto.setImages(imageDtos);
        return productDto;
    }

    @Override
    public List<Product> findDistinctProductsByName() {
        List<Product> products = productRepository.findAll();
        Map<String, Product> distinctProductsMap = products.stream()
                .collect(Collectors.toMap(
                        Product::getName,
                        product -> product,
                        (existing, replacement) -> existing));
        return new ArrayList<>(distinctProductsMap.values());
    }

    @Override
    public List<String> getAllDistinctBrands() {
//        return productRepository.findAll().stream()
//                .map(Product::getBrand)
//                .distinct()
//                .collect(Collectors.toList());
        return null;
    }

}
