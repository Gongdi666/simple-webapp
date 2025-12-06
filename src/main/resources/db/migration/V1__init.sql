-- ユーザーテーブル（既存の user.entity.User に合わせる）
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ENGINEER'
);

-- 案件テーブル（project.model.Project に合わせる）
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    client VARCHAR(200),
    tech_stack VARCHAR(255),
    unit_price INTEGER,
    work_style VARCHAR(100)
);

-- エンジニアごとの LIKE / DISLIKE / HOLD 集計用テーブル（今後のフェーズ用）
CREATE TABLE project_likes (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    verdict VARCHAR(20) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_project_likes_verdict
        CHECK (verdict IN ('LIKE', 'DISLIKE', 'HOLD')),

    CONSTRAINT fk_project_likes_project
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,

    CONSTRAINT fk_project_likes_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT uq_project_likes_user_project
        UNIQUE (project_id, user_id)
);

CREATE INDEX idx_project_likes_user_id
    ON project_likes(user_id);

CREATE INDEX idx_project_likes_project_id
    ON project_likes(project_id);

CREATE INDEX idx_project_likes_verdict
    ON project_likes(verdict);

-- もともとの data.sql と同じ初期データをここで投入
INSERT INTO projects (title, client, tech_stack, unit_price, work_style) VALUES
('Java/Spring SES案件', '某SIer', 'Java, Spring Boot, PostgreSQL', 750000, 'フルリモート'),
('フロントReact案件', 'Web系自社', 'React, TypeScript, Vite', 800000, '週1出社'),
('モダンバックエンド', 'スタートアップ', 'Kotlin, Spring Boot, AWS', 900000, 'フルリモート');