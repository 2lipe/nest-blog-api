import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, UpdateArticleDTO } from 'src/models/dtos/article.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private _articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private _userRepository: Repository<UserEntity>,
  ) {}

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

      await article.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    try {
      const article = await this.findBySlug(slug);

      this.ensureOwnership(user, article);

      await this._articleRepository.update({ slug }, data);
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

  private ensureOwnership(user: UserEntity, article: ArticleEntity) {
    return article.author.id === user.id;
  }
}
