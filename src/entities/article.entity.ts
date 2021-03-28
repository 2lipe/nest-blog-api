import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne, RelationCount } from 'typeorm';
import * as slugify from 'slug';

import { AbstractEntity } from './abstract-entity';
import { UserEntity } from './user.entity';
import { classToPlain } from 'class-transformer';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @ManyToMany(() => UserEntity, (user) => user.favorites, { eager: true })
  @JoinColumn()
  favorites: UserEntity[];

  @RelationCount((article: ArticleEntity) => article.favorites)
  favoritesCount: number;

  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity;

  @Column('simple-array')
  tagList: string[];

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJSON() {
    return classToPlain(this);
  }

  toArticle(user: UserEntity) {
    let favorited = null;

    if (user) {
      favorited = this.favorites.includes(user);
    }

    const article: any = this.toJSON();

    delete article.favorites;

    return { ...article, favorited };
  }
}
