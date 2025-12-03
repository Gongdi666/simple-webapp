package project.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.entity.Project;
import project.entity.ProjectLike;
import project.entity.ProjectVerdict;
import project.repository.ProjectLikeCount;
import user.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectLikeRepository extends JpaRepository<ProjectLike, Long> {

    // ① user × project の最新評価（Upsert 用）
    Optional<ProjectLike> findByProjectAndUser(Project project, User user);

    // ② 同一ユーザがすでに評価済みか確認（UNIQUE 対応）
    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    // ③ 案件ごとの LIKE / DISLIKE / HOLD 数
    long countByProjectAndVerdict(Project project, ProjectVerdict verdict);

    // ④ 案件ごとの評価一覧
    List<ProjectLike> findByProjectId(Long projectId);

    // ⑤ 特定 verdict のランキング（汎用）
    @Query("""
        select pl.project as project, count(pl) as likes
        from ProjectLike pl
        where pl.verdict = :verdict
        group by pl.project
        order by count(pl) desc
        """)
    List<ProjectLikeCount> findTopByVerdict(
            @Param("verdict") ProjectVerdict verdict,
            Pageable pageable
    );

    // ⑥ 特定ユーザが LIKE した案件一覧
    @Query("""
        select pl.project
        from ProjectLike pl
        where pl.user.id = :userId
          and pl.verdict = 'LIKE'
        """)
    List<Project> findLikedProjectsByUserId(@Param("userId") Long userId);
}