package project;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = {
        "project.repository",
        "user.repository"      // ★ 追加
})
@EntityScan(basePackages = {
        "project.model",
        "user.entity"          // ★ 追加（User エンティティのパッケージ）
})
public class JpaConfig {
}