package project.dto;

import lombok.Value;
import project.entity.ProjectLike;
import project.entity.ProjectVerdict;

import java.time.OffsetDateTime;

/**
 * スワイプ結果のレスポンス用 DTO.
 * Entity の user / project そのものは返さず、
 * 必要な ID と情報だけをフラットに持たせる。
 */
@Value
public class ProjectLikeResponse {

    Long id;
    Long projectId;
    Long userId;
    String verdict;
    String comment;
    OffsetDateTime createdAt;

    public static ProjectLikeResponse from(ProjectLike like) {
        return new ProjectLikeResponse(
                like.getId(),
                like.getProject().getId(),
                like.getUser().getId(),
                like.getVerdict(),
                like.getComment(),
                like.getCreatedAt()
        );
    }
}