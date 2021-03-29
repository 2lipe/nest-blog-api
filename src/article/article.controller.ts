import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from 'src/auth/configs/optional-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, UpdateArticleDTO } from 'src/models/dtos/article.dto';
import { IFindAllQuery, IFindFeedQuery } from 'src/models/interfaces/article';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private _articleSerive: ArticleService) {}

  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(@User() user: UserEntity, @Query() query: IFindAllQuery) {
    const articles = await this._articleSerive.findAll(user, query);

    return { articles, articlesCount: articles.length };
  }

  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(@User() user: UserEntity, @Query() query: IFindFeedQuery) {
    const articles = await this._articleSerive.findFeed(user, query);

    return { articles, articlesCount: articles.length };
  }

  @Get('/:slug')
  @UseGuards(new OptionalAuthGuard())
  async findBySlug(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this._articleSerive.findBySlug(slug);

    return { article: article.toArticle(user) };
  }

  @Post('/:slug')
  @UseGuards(AuthGuard())
  async createArticle(@User() user: UserEntity, @Body(ValidationPipe) data: { article: CreateArticleDTO }) {
    const article = await this._articleSerive.createArticle(user, data.article);

    return { article };
  }

  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    @Param() slug: string,
    @User() user: UserEntity,
    @Body(ValidationPipe) data: { article: UpdateArticleDTO },
  ) {
    const article = await this._articleSerive.updateArticle(slug, user, data.article);

    return { article };
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(@Param() slug: string, @User() user: UserEntity) {
    const article = await this._articleSerive.deleteArticle(slug, user);

    return { article };
  }

  @Post('/:slug/favorite')
  @UseGuards(AuthGuard())
  async favoriteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this._articleSerive.favoriteArticle(slug, user);

    return { article };
  }

  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard())
  async unfavoriteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this._articleSerive.unfavoriteArticle(slug, user);

    return { article };
  }
}
