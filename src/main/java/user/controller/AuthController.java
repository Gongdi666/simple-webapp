package user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import security.JwtTokenProvider;
import security.dto.LoginRequest;
import security.dto.LoginResponse;
import security.dto.LoginSuccessResponse;
import user.entity.User;
import user.service.CustomUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            // JWT 生成
            String token = jwtTokenProvider.generateToken(auth);

            // username から User を取得
            UserDetails details = customUserDetailsService.loadUserByUsername(request.getUsername());
            User user = (User) ((security.CustomUserDetails) details).getUser();

            // ロールは DB に保存されている値を返す
            String role = user.getRole();

            return ResponseEntity.ok(
                    new LoginResponse(
                            token,
                            user.getUsername(),
                            role
                    )
            );

        } catch (AuthenticationException ex) {
            ex.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
    }
}