-- Tinder UI向けの拡張

ALTER TABLE projects
    ADD COLUMN image_url TEXT,
    ADD COLUMN description TEXT,
    ADD COLUMN summary TEXT,
    ADD COLUMN sort_order INTEGER DEFAULT 0;

-- 既存案件にデフォルトのダミー画像を追加
UPDATE projects
SET image_url = 'https://placehold.jp/600x800.png',
    summary = CONCAT(title, '（', client, '）')
WHERE image_url IS NULL;