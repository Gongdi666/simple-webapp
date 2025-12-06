package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.dto.CreateProjectRequest;
import project.dto.ProjectLikeRankingDto;
import project.dto.ProjectRankingResponse;
import project.entity.Project;
import project.repository.ProjectLikeRepository;
import project.repository.ProjectRepository;
import user.repository.UserRepository;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectLikeRepository projectLikeRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    private final ProjectAiFormatter projectAiFormatter;

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + id));
    }

    // ① 自分が Like した案件一覧
    public List<Project> getLikedProjects(Long userId) {
        return projectLikeRepository.findLikedProjectsByUserId(userId);
    }

    // ② Like ランキング
//    public List<ProjectRankingResponse> getProjectRanking() {
//        List<Map<String, Object>> raw = projectLikeRepository.getProjectRanking();
//
//        return raw.stream()
//                .map(row -> new ProjectRankingResponse(
//                        ((Number) row.get("projectId")).longValue(),
//                        ((String) row.get("title")),
//                        ((Number) row.get("likeCount")).longValue()
//                ))
//                .toList();
//    }
//
//    /**
//     * プロジェクトごとの Like 数ランキングを返却
//     */
//    public List<ProjectLikeRankingDto> getProjectLikeRanking() {
//        List<Object[]> rows = projectLikeRepository.countLikesGroupByProject();
//
//        return rows.stream()
//                .map(row -> new ProjectLikeRankingDto(
//                        ((Number) row[0]).longValue(),   // projectId
//                        ((Number) row[1]).longValue()    // likeCount
//                ))
//                .toList();
//    }

    @Transactional
    public Project create(Project project) {
        return projectRepository.save(project);
    }

    /**
     * DTO + AI整形 + created_by 対応版
     */
    @Transactional
    public Project createProject(CreateProjectRequest req, Long userId) {

        // AIによる整形（rawMemo がある場合のみ）
        ProjectAiFormatter.AiResult ai = projectAiFormatter.format(req);

        Project p = new Project();
        p.setTitle(req.title());
        p.setClient(req.client());
        p.setTechStack(req.techStack());
        p.setUnitPrice(req.unitPrice());
        p.setWorkStyle(req.workStyle());
        p.setImageUrl(req.imageUrl());
        p.setSortOrder(req.sortOrder());

        // summary
        if (req.summary() != null) {
            p.setSummary(req.summary());
        } else {
            p.setSummary(ai.summary());
        }

        // description
        if (req.description() != null) {
            p.setDescription(req.description());
        } else {
            p.setDescription(ai.description());
        }

        // created_by（ログインユーザー）
        p.setCreatedBy(userId);

        return projectRepository.save(p);
    }
}