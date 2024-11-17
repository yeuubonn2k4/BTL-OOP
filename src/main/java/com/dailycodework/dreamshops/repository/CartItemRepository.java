package com.dailycodework.dreamshops.repository;

import com.dailycodework.dreamshops.model.CartItem;
import com.dailycodework.dreamshops.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    void deleteAllByCartId(Long id);
    List<CartItem> findByProductId(Long productId);
}
