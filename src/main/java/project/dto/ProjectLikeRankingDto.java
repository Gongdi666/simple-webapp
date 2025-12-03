package project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProjectLikeRankingDto {
    private Long projectId;
    private long likeCount;
}