package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.dto.ProjectLikeRequest;
import project.dto.ProjectLikeResponse;
import project.entity.ProjectLike;
import project.service.ProjectLikeService;
import security.CustomUserDetails;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/project-likes")
@RequiredArgsConstructor
public class ProjectLikeController {

    private final ProjectLikeService projectLikeService;

    /**
     * スワイプ結果（LIKE / DISLIKE / HOLD）の登録（Upsert 相当）
     * フロントからは JSON:
     * { "projectId": 1, "verdict": "LIKE", "comment": "" }
     * が送られてくる前提。
     */
    @PostMapping
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
     * 指定プロジェクトのスワイプ結果一覧取得（用途が出てきたら使う想定）
     */
    @GetMapping("/{projectId}")
    public List<ProjectLikeResponse> getVotes(@PathVariable Long projectId) {
        return projectLikeService.getProjectVotes(projectId).stream()
                .map(ProjectLikeResponse::from)
                .collect(Collectors.toList());
    }
}