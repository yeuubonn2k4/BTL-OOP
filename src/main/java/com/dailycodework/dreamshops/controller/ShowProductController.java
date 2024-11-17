package com.dailycodework.dreamshops.controller;


import com.dailycodework.dreamshops.model.Product;
import com.dailycodework.dreamshops.service.product.IProductService;
import com.dailycodework.dreamshops.service.product.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class ShowProductController {

    @Autowired
    private IProductService productService;

//    @RequestMapping(value = "/chitietspham.html" ,method = RequestMethod.GET)
//    public String viewProduct(@RequestParam String productName, Model model){
//        List<Product> products = productService.getProductsByName(productName);
//        model.addAttribute("products", products);
//        return "chitietspham";
//    }
    @GetMapping("/chitietspham.html")
    public String viewProduct(){
        return "chitietspham";
    }
}
