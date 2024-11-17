package com.dailycodework.dreamshops.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
    // Map this to the root or any other desired path to serve index.html
    @GetMapping({"/", "/index.html", "/logo", "/index","/footer"})
    public String index() {
        return "index";  // Spring Boot will look for index.html in resources/templates
    }

    @GetMapping({"/tuyendung", "/tuyendung.html"})
    public String tuyenDung(){
        return "tuyendung";
    }

    @GetMapping({"/gioithieu", "/gioithieu.html"})
    public String gioiThieu(){
        return "gioithieu";
    }

    @GetMapping({"/trungtambaohanh", "/trungtambaohanh.html"})
    public String trungTamBaoHanh(){
        return "trungtambaohanh";
    }

    @GetMapping({"/lienhe", "/lienhe.html"})
    public String lienHe(){
        return "lienhe";
    }

    @GetMapping({"/tintuc","/tintuc.html"})
    public String tinTuc(){
        return "tintuc";
    }

    @RequestMapping({"nguoidung", "nguoidung.html"})
    public String trangNguoiDung(){
        return "nguoidung";
    }

    @RequestMapping({"giohang", "giohang.html"})
    public String gioHang(){
        return "giohang";
    }
}
