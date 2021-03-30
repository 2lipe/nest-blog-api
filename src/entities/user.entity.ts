import { Entity, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude, classToPlain } from 'class-transformer';
import { IsEmail } from 'class-validator';

import { AbstractEntity } from './abstract-entity';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comments.entity';
import { IUserResponse } from 'src/models/interfaces/user';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column()
  @IsEmail()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @Column()
  @Exclude()
  password: string;

  @ManyToMany(() => UserEntity, (user) => user.followee)
  @JoinTable()
  followers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.followers)
  followee: UserEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @ManyToMany(() => ArticleEntity, (article) => article.favoritedBy)
  favorites: ArticleEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toJSON(): IUserResponse {
    return <IUserResponse>classToPlain(this);
  }

  toProfile(user?: UserEntity) {
    let following = null;

    if (user) {
      following = this.followers.includes(user);
    }

    const profile: any = this.toJSON();

    delete profile.followers;

    return { ...profile, following };
  }
}
