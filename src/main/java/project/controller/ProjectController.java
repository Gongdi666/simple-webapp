package project.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import project.model.Project;
import project.repository.ProjectRepository;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // 後で作るフロント用（Viteのデフォルトポート）
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping("/api/projects")
    public List<Project> list() {
        return projectRepository.findAll();
    }
}