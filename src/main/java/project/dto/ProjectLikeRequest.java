package project.dto;

import lombok.Data;
import project.entity.ProjectVerdict;

@Data
public class ProjectLikeRequest {
    private Long projectId;
    private ProjectVerdict verdict;
    private String comment;
}