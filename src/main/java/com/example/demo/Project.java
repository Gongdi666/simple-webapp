package com.example.demo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class Project {

    private Long id;
    private String title;          // 案件タイトル
    private String client;         // 客先 or エンド名
    private String techStack;      // Java / Spring / AWS など
    private int unitPrice;         // 単価(万円)
    private String workStyle;      // フルリモート / 週1出社 など
}