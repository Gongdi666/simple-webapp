package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import project.dto.CreateProjectRequest;
import project.dto.ProjectLikeRankingDto;
import project.entity.Project;
import project.service.ProjectService;
import security.CustomUserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(
            @RequestBody CreateProjectRequest req,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        Long userId = user.getId();
        return projectService.createProject(req, userId);
    }
}