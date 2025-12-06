package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import user.entity.User;
import user.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.findByUsername("test")
                    .ifPresentOrElse(
                            user -> {
                                // すでに存在するので何もしない
                            },
                            () -> {
                                User user = new User();
                                user.setUsername("test");
                                user.setPassword(passwordEncoder.encode("password"));
                                user.setRole("ENGINEER"); // enumや別カラムなら合わせて
                                userRepository.save(user);
                            }
                    );
        };
    }
}