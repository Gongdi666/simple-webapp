package project.dto;

public record CreateProjectRequest(
        String rawMemo,
        String title,
        String client,
        String techStack,
        Integer unitPrice,
        String workStyle,
        String imageUrl,
        String summary,
        String description,
        Integer sortOrder
) {}