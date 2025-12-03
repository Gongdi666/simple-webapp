package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import project.dto.ProjectLikeRequest;
import project.entity.Project;
import project.entity.ProjectLike;
import project.entity.ProjectVerdict;
import project.repository.ProjectRepository;
import project.service.ProjectLikeService;
import security.CustomUserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/project-likes")
@RequiredArgsConstructor
public class ProjectLikeController {

    private final ProjectLikeService projectLikeService;
    private final ProjectRepository projectRepository;

    /**
     * スワイプ結果（LIKE / DISLIKE / HOLD）の登録（Upsert）
     */
    @PostMapping
    public ProjectLike addOrUpdateVote(
            @RequestBody ProjectLikeRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return projectLikeService.addOrUpdateVote(
                request.getProjectId(),
                userDetails.getUser(),
                request.getVerdict(),
                request.getComment()
        );
    }

    /**
     * 案件ごとの評価一覧
     */
    @GetMapping("/{projectId}")
    public List<ProjectLike> getProjectVotes(@PathVariable Long projectId) {
        return projectLikeService.getProjectVotes(projectId);
    }

    /**
     * ログインユーザーが LIKE した案件一覧
     */
    @GetMapping("/my")
    public List<Project> getMyLikes(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return projectLikeService.getUserLikedProjects(userDetails.getUser().getId());
    }

    /**
     * LIKE 数ランキング（DESC）
     */
    @GetMapping("/ranking")
    public List<?> getRanking(@RequestParam(defaultValue = "10") int limit) {
        return projectLikeService.getTopRankedProjects(limit);
    }
}