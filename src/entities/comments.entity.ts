import { Entity, Column, ManyToOne } from 'typeorm';
import { classToPlain } from 'class-transformer';

import { AbstractEntity } from './abstract-entity';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity';
import { ICommentResponse } from 'src/models/interfaces/comment';

@Entity('comments')
export class CommentEntity extends AbstractEntity {
  @Column()
  body: string;

  @ManyToOne(() => UserEntity, (user) => user.comments, { eager: true })
  author: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;

  toJSON() {
    return <ICommentResponse>classToPlain(this);
  }
}
