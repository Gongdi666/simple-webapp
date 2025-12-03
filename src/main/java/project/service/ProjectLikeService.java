package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.entity.Project;
import project.entity.ProjectLike;
import project.entity.ProjectVerdict;
import project.repository.ProjectLikeCount;
import project.repository.ProjectLikeRepository;
import project.repository.ProjectRepository;
import user.entity.User;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectLikeService {

    private final ProjectLikeRepository projectLikeRepository;
    private final ProjectRepository projectRepository;

    /**
     * Upsert:
     * - すでに user × project の評価がある → update
     * - ない → insert
     */
    public ProjectLike addOrUpdateVote(Long projectId, User user, ProjectVerdict verdict, String comment) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        Optional<ProjectLike> existing = projectLikeRepository.findByProjectAndUser(project, user);

        if (existing.isPresent()) {
            // ---- UPDATE ----
            ProjectLike like = existing.get();
            like.setVerdict(verdict.name());
            like.setComment(comment);
            // createdAt は上書きしない
            return projectLikeRepository.save(like);
        }

        // ---- INSERT ----
        ProjectLike like = ProjectLike.builder()
                .project(project)
                .user(user)
                .verdict(verdict.name())
                .comment(comment)
                .createdAt(OffsetDateTime.now())
                .build();

        return projectLikeRepository.save(like);
    }

    /**
     * プロジェクトごとの全評価
     */
    public List<ProjectLike> getProjectVotes(Long projectId) {
        return projectLikeRepository.findByProjectId(projectId);
    }

    /**
     * verdict ごとの Like / Dislike / Hold 数取得
     */
    public long countVerdict(Long projectId, ProjectVerdict verdict) {
        Project p = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        return projectLikeRepository.countByProjectAndVerdict(p, verdict);
    }

    /**
     * Like 数ランキング（上位 n件）
     */
    public List<ProjectLikeCount> getTopRankedProjects(int limit) {
        return projectLikeRepository.findTopByVerdict(
                ProjectVerdict.LIKE,
                PageRequest.of(0, limit)
        );
    }

    /**
     * 特定ユーザーが LIKE したプロジェクト一覧
     */
    public List<Project> getUserLikedProjects(Long userId) {
        return projectLikeRepository.findLikedProjectsByUserId(userId);
    }
}