import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { ArticleEntity } from 'src/entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import { TagEntity } from 'src/entities/tag.entity';
import { IArticleResponse, IFindAllQuery, IFindFeedQuery } from 'src/models/interfaces/article';
import { CreateArticleDTO, UpdateArticleDTO } from 'src/models/dtos/article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private _articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private _userRepository: Repository<UserEntity>,
    @InjectRepository(TagEntity) private _tagRepository: Repository<TagEntity>,
  ) {}

  async findAll(user: UserEntity, query: IFindAllQuery): Promise<IArticleResponse[]> {
    try {
      // eslint-disable-next-line prefer-const
      let findOptions: any = {
        where: {},
      };

      if (query.author) {
        findOptions.where['author.username'] = query.author;
      }

      if (query.favorited) {
        findOptions.where['favoritedBy.username'] = query.favorited;
      }

      if (query.tag) {
        findOptions.where.tagList = Like(`%${query.tag}%`);
      }

      if (query.offset) {
        findOptions.offset = query.offset;
      }

      if (query.limit) {
        findOptions.limit = query.limit;
      }

      return (await this._articleRepository.find(findOptions)).map((article) => article.toArticle(user));
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findFeed(user: UserEntity, query: IFindFeedQuery): Promise<IArticleResponse[]> {
    try {
      const { followee } = await this._userRepository.findOne({
        where: { id: user.id },
        relations: ['followee'],
      });

      const findOptions = {
        ...query,
        where: followee.map((follow) => ({ author: follow.id })),
      };

      return (await this._articleRepository.find(findOptions)).map((article) => article.toArticle(user));
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findBySlug(slug: string): Promise<ArticleEntity> {
    return this._articleRepository.findOne({
      where: { slug },
    });
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO): Promise<IArticleResponse> {
    try {
      const article = this._articleRepository.create(data);

      article.author = user;

      await this.upsertTags(data.tagList);

      const { slug } = await article.save();

      return (await this._articleRepository.findOne({ slug })).toArticle(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO): Promise<IArticleResponse> {
    try {
      const article = await this.findBySlug(slug);

      if (!this.ensureOwnership(user, article)) {
        throw new UnauthorizedException();
      }

      await this._articleRepository.update({ slug }, data);

      return article.toArticle(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteArticle(slug: string, user: UserEntity): Promise<IArticleResponse> {
    try {
      const article = await this.findBySlug(slug);

      if (!this.ensureOwnership(user, article)) {
        throw new UnauthorizedException();
      }

      await this._articleRepository.remove(article);

      return article.toArticle(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async favoriteArticle(slug: string, user: UserEntity): Promise<IArticleResponse> {
    try {
      const article = await this.findBySlug(slug);

      article.favoritedBy.push(user);

      await article.save();

      return (await this.findBySlug(slug)).toArticle(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async unfavoriteArticle(slug: string, user: UserEntity): Promise<IArticleResponse> {
    try {
      const article = await this.findBySlug(slug);

      article.favoritedBy = article.favoritedBy.filter((fav) => fav.id !== user.id);

      await article.save();

      return (await this.findBySlug(slug)).toArticle(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private async upsertTags(tagList: string[]): Promise<void> {
    try {
      const foundTags = await this._tagRepository.find({
        where: tagList.map((t) => ({ tag: t })),
      });

      const newTags = tagList.filter((t) => !foundTags.map((t) => t.tag).includes(t));

      await Promise.all(this._tagRepository.create(newTags.map((t) => ({ tag: t }))).map((t) => t.save()));
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === user.id;
  }
}
