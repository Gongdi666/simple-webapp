package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.dto.ProjectLikeRequest;
import project.dto.ProjectLikeResponse;
import project.entity.Project;
import project.entity.ProjectLike;
import project.service.ProjectLikeService;
import project.service.ProjectService;
import security.CustomUserDetails;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/swipe")
@RequiredArgsConstructor
public class SwipeController {

    private final ProjectService projectService;
    private final ProjectLikeService projectLikeService;

    /**
     * ① スワイプ用案件一覧取得
     *
     */
    @GetMapping("/projects")
    public List<Project> getSwipeProjects() {
        return projectService.findAll();
        // 必要なら filter（未LIKEだけ）に変える
    }

    /**
     * ② LIKE / DISLIKE 登録
     *
     */
    @PostMapping("/project-likes")
    public ProjectLikeResponse addOrUpdateVote(
            @RequestBody ProjectLikeRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        if (userDetails == null) {
            // 認証情報が取れていない場合は 401 を返す
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        ProjectLike saved = projectLikeService.addOrUpdateVote(
                request.getProjectId(),
                userDetails.getUser(),
                request.getVerdict(),   // Service 側が String verdict を受け取る実装のため
                request.getComment()
        );

        // Entity -> DTO に詰め替えて返却（user / project の Hibernate プロキシは返さない）
        return ProjectLikeResponse.from(saved);
    }

    /**
     * ③ ある案件の LIKE 情報一覧
     */
    @GetMapping("/project-likes/{projectId}")
    public List<ProjectLikeResponse> getVotes(@PathVariable Long projectId) {
        return projectLikeService.getProjectVotes(projectId).stream()
                .map(ProjectLikeResponse::from)
                .collect(Collectors.toList());
    }
}