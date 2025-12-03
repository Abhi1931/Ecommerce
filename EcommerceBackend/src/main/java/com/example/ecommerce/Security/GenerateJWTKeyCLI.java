package com.example.ecommerce.Security;

import java.util.Base64;
import java.security.SecureRandom;

public class GenerateJWTKeyCLI {
    public static void main(String[] args) {
        byte[] randomBytes = new byte[32]; // 256 bits
        new SecureRandom().nextBytes(randomBytes);
        String key = Base64.getEncoder().encodeToString(randomBytes);
        System.out.println("Generated JWT Secret (Base64): " + key);
    }
}
