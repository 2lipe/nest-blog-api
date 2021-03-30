import { Controller, Get, Param, Post, UseGuards, Body, ValidationPipe, Put, Delete, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';

import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { CommentsService } from './comments.service';
import { ArticleService } from './article.service';
import { OptionalAuthGuard } from 'src/auth/configs/optional-auth.guard';
import { IArticleResponse, IFindAllQuery, IFindFeedQuery } from 'src/models/interfaces/article';
import { ResponseObject } from 'src/models/dtos/response-base.dto';
import { CreateArticleBody, CreateArticleDTO, UpdateArticleBody, UpdateArticleDTO } from 'src/models/dtos/article.dto';
import { ICommentResponse } from 'src/models/interfaces/comment';
import { CreateCommentBody, CreateCommentDTO } from 'src/models/dtos/comment.dto';

@Controller('articles')
export class ArticleController {
  constructor(private _articleService: ArticleService, private _commentService: CommentsService) {}

  @ApiOkResponse({ description: 'List all articles' })
  @Get()
  @UseGuards(new OptionalAuthGuard())
  async findAll(
    @User() user: UserEntity,
    @Query() query: IFindAllQuery,
  ): Promise<ResponseObject<'articles', IArticleResponse[]> & ResponseObject<'articlesCount', number>> {
    const articles = await this._articleService.findAll(user, query);

    return {
      articles,
      articlesCount: articles.length,
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'List all articles of users feed' })
  @ApiUnauthorizedResponse()
  @Get('/feed')
  @UseGuards(AuthGuard())
  async findFeed(
    @User() user: UserEntity,
    @Query() query: IFindFeedQuery,
  ): Promise<ResponseObject<'articles', IArticleResponse[]> & ResponseObject<'articlesCount', number>> {
    const articles = await this._articleService.findFeed(user, query);

    return { articles, articlesCount: articles.length };
  }

  @ApiOkResponse({ description: 'Article with slug :slug' })
  @Get('/:slug')
  @UseGuards(new OptionalAuthGuard())
  async findBySlug(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'article', IArticleResponse>> {
    const article = await this._articleService.findBySlug(slug);

    return { article: article.toArticle(user) };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Create article' })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: CreateArticleBody })
  @Post()
  @UseGuards(AuthGuard())
  async createArticle(
    @User() user: UserEntity,
    @Body('article', ValidationPipe) data: CreateArticleDTO,
  ): Promise<ResponseObject<'article', IArticleResponse>> {
    const article = await this._articleService.createArticle(user, data);

    return { article };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Update article' })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: UpdateArticleBody })
  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body('article', ValidationPipe) data: UpdateArticleDTO,
  ): Promise<ResponseObject<'article', IArticleResponse>> {
    const article = await this._articleService.updateArticle(slug, user, data);

    return { article };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete article' })
  @ApiUnauthorizedResponse()
  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(
    @Param() slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'article', IArticleResponse>> {
    const article = await this._articleService.deleteArticle(slug, user);

    return { article };
  }

  @ApiOkResponse({ description: 'List article comments' })
  @Get('/:slug/comments')
  async findComments(@Param('slug') slug: string): Promise<ResponseObject<'comments', ICommentResponse[]>> {
    const comments = await this._commentService.findByArticleSlug(slug);

    return { comments };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Create new comment' })
  @ApiUnauthorizedResponse()
  @ApiBody({ type: CreateCommentBody })
  @Post('/:slug/comments')
  async createComment(
    @User() user: UserEntity,
    @Body('comment', ValidationPipe) data: CreateCommentDTO,
  ): Promise<ResponseObject<'comment', ICommentResponse>> {
    const comment = await this._commentService.createComment(user, data);

    return { comment };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete comment' })
  @ApiUnauthorizedResponse()
  @Delete('/:slug/comments/:id')
  async deleteComment(
    @User() user: UserEntity,
    @Param('id') id: number,
  ): Promise<ResponseObject<'comment', ICommentResponse>> {
    const comment = await this._commentService.deleteComment(user, id);

    return { comment };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Favorite article' })
  @ApiUnauthorizedResponse()
  @Post('/:slug/favorite')
  @UseGuards(AuthGuard())
  async favoriteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'article', IArticleResponse>> {
    const article = await this._articleService.favoriteArticle(slug, user);

    return { article };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Unfavorite article' })
  @ApiUnauthorizedResponse()
  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard())
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
  ): Promise<ResponseObject<'article', IArticleResponse>> {
    const article = await this._articleService.unfavoriteArticle(slug, user);

    return { article };
  }
}
