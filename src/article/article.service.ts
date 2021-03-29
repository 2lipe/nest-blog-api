import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, UpdateArticleDTO } from 'src/models/dtos/article.dto';
import { IFindAllQuery, IFindFeedQuery } from 'src/models/interfaces/article';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private _articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private _userRepository: Repository<UserEntity>,
  ) {}

  async findAll(user: UserEntity, query: IFindAllQuery) {
    try {
      const findOptions: any = {
        where: {},
      };

      if (query.author) {
        findOptions.where['author.username'] = query.author;
      }

      if (query.favorited) {
        findOptions.where['favorites.username'] = query.favorited;
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

      const articles = (await this._articleRepository.find(findOptions)).map((article) => article.toArticle(user));

      return articles;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findFeed(user: UserEntity, query: IFindFeedQuery) {
    try {
      const { following } = await this._userRepository.findOne({ where: { id: user.id }, relations: ['following'] });

      const findOptions = { ...query, where: following.map((follow) => ({ author: follow.id })) };

      const articles = (await this._articleRepository.find(findOptions)).map((article) => article.toArticle(user));

      return articles;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findBySlug(slug: string) {
    try {
      const article = await this._articleRepository.findOne({ where: { slug } });

      return article;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO) {
    try {
      const article = this._articleRepository.create(data);

      article.author = user;

      const { slug } = await article.save();

      return (await this._articleRepository.findOne({ slug })).toArticle(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    try {
      const article = await this.findBySlug(slug);

      this.ensureOwnership(user, article);

      await this._articleRepository.update({ slug }, data);

      return article.toArticle(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteArticle(slug: string, user: UserEntity) {
    try {
      const article = await this.findBySlug(slug);

      const noOwner = !this.ensureOwnership(user, article);

      if (noOwner) {
        return new UnauthorizedException();
      }

      await this._articleRepository.remove(article);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async favoriteArticle(slug: string, user: UserEntity) {
    try {
      const article = await this.findBySlug(slug);

      article.favorites.push(user);

      await article.save();

      return (await this.findBySlug(slug)).toArticle(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async unfavoriteArticle(slug: string, user: UserEntity) {
    try {
      const article = await this.findBySlug(slug);

      article.favorites = article.favorites.filter((fav) => fav.id !== user.id);

      await article.save();

      return (await article.toArticle(user)).toArticle(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private ensureOwnership(user: UserEntity, article: ArticleEntity) {
    return article.author.id === user.id;
  }
}
