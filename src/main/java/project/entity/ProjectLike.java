package project.entity;

import jakarta.persistence.*;
import lombok.*;
import user.entity.User;

@Entity
@Table(name = "project_likes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ★ ここを verdict に変更
    @Column(name = "verdict", nullable = false, length = 20)
    private String verdict;   // LIKE / DISLIKE / HOLD

    private String comment;

    @Column(name = "created_at", nullable = false)
    private java.time.OffsetDateTime createdAt;
}