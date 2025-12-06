package project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String client;

    @Column(name = "tech_stack")
    private String techStack;

    @Column(name = "unit_price")
    private Integer unitPrice;

    @Column(name = "work_style")
    private String workStyle;

    // --- 追加 ---
    @Column(name = "image_url")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String summary;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_by")
    private Long createdBy;
}