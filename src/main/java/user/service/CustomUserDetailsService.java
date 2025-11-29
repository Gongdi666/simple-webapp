package user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import user.entity.User;              // ★ こっちの User を import
import user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        // ★ エンティティの User
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("not found: " + username));

        // ★ ここでセキュリティ用の UserDetails を作る
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())  // DBに入ってるパスワード
                .authorities(user.getRole())
                .build();
    }
}