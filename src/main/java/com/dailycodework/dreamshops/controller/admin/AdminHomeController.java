package com.dailycodework.dreamshops.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AdminHomeController {

    @RequestMapping("/admin.html")
    public String welcomeAdmin(){
        return "admin";
    }

}
