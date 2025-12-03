package project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import project.dto.ProjectLikeRankingDto;
import project.entity.Project;
import project.service.ProjectService;
import security.CustomUserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<Project> getProjects() {
        return projectService.findAll();
    }

    @GetMapping("/{id}")
    public Project getProject(@PathVariable Long id) {
        return projectService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@RequestBody Project project) {
        // プロトタイプなので、いったんそのまま受け取る
        return projectService.create(project);
    }

    // ① 自分が Like した案件
    @GetMapping("/liked")
    public ResponseEntity<?> getLikedProjects(@AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user.getId();
        return ResponseEntity.ok(projectService.getLikedProjects(userId));
    }
}