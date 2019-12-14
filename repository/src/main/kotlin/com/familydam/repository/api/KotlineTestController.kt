package com.familydam.repository.api

import org.springframework.web.bind.annotation.GetMapping

//@RestController
class KotlineTestController {

    //@GetMapping("/kotlin")
    fun helloKotlin(): String {
        return "hello from kotlin"
    }

}

