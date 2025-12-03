package project.entity;

/**
 * V1__init.sql の project_likes.verdict に対応する評価区分
 */
public enum ProjectVerdict {
    LIKE,      // 「この案件いいね」
    DISLIKE,   // 「この案件は微妙」
    HOLD       // 「保留」
}