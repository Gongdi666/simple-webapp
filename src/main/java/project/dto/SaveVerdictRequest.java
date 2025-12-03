package project.dto;

import lombok.Getter;
import lombok.Setter;
import project.entity.ProjectVerdict;

@Getter
@Setter
public class SaveVerdictRequest {
    private ProjectVerdict verdict; // LIKE / DISLIKE / HOLD
    private String comment;         // 任意コメント
}