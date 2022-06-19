import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("posts")
export class Posts {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ length: 500 })
    title: string;

  @Column("text")
    path: string;

  @Column("text")
    content: string;

  @Column("text")
    tags: string;

  @Column("text")
    slug: string;

  @Column("text")
    views: number;

  @Column("text")
    thumbs: number;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;
}