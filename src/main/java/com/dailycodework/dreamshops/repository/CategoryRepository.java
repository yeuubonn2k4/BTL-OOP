package com.dailycodework.dreamshops.repository;

import com.dailycodework.dreamshops.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
  Category findByName(String name);

//  @Query("SELECT c FROM Category WHERE c.name LIKE %?1%")
//  List<Category> searchCategory(String search);
  boolean existsByName(String name);
}
