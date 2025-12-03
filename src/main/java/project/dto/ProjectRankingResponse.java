package project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import project.entity.Project;

@Getter
@AllArgsConstructor
public class ProjectRankingResponse {

    private Long projectId;
    private String title;
    private long likeCount;

    public static ProjectRankingResponse from(Project project, long likeCount) {
        return new ProjectRankingResponse(
                project.getId(),
                project.getTitle(),
                likeCount
        );
    }
}