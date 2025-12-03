package project.repository;

import project.entity.Project;

/**
 * 案件ごとのLIKE数をまとめて取るための Projection
 */
public interface ProjectLikeCount {
    Project getProject();
    long getLikes();
}