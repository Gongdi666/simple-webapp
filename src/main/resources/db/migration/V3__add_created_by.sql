ALTER TABLE projects
    ADD COLUMN created_by BIGINT;

ALTER TABLE projects
    ADD CONSTRAINT fk_projects_created_by
        FOREIGN KEY (created_by) REFERENCES users(id);