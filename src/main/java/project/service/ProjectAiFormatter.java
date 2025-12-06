package project.service;

import org.springframework.stereotype.Component;
import project.dto.CreateProjectRequest;

@Component
public class ProjectAiFormatter {

    /**
     * 今は AI を使わず、ダミー処理。
     * 後で OpenAI API に差し替え可能な構造。
     */
    public AiResult format(CreateProjectRequest req) {

        if (req.rawMemo() == null || req.rawMemo().isBlank()) {
            return new AiResult(null, null);
        }

        // ざっくりメモから簡易 summary / description だけ生成（ダミー）
        String summary = "要約: " + req.rawMemo().split("\n")[0];
        String description = "詳細: \n" + req.rawMemo();

        return new AiResult(summary, description);
    }

    public record AiResult(String summary, String description) {}
}