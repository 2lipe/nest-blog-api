import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from 'src/auth/configs/optional-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, UpdateArticleDTO } from 'src/models/dtos/article.dto';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private _articleSerive: ArticleService) {}

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
}
