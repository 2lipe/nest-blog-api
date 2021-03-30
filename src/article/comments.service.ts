import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/entities/user.entity';
import { CommentEntity } from 'src/entities/comments.entity';
import { CreateCommentDTO } from 'src/models/dtos/comment.dto';
import { ICommentResponse } from 'src/models/interfaces/comment';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private _commentRepository: Repository<CommentEntity>,
  ) {}

  findByArticleSlug(slug: string): Promise<ICommentResponse[]> {
    return this._commentRepository.find({
      where: { 'article.slug': slug },
      relations: ['article'],
    });
  }

  findById(id: number): Promise<ICommentResponse> {
    return this._commentRepository.findOne({ where: { id } });
  }

  async createComment(user: UserEntity, data: CreateCommentDTO): Promise<ICommentResponse> {
    try {
      const comment = this._commentRepository.create(data);

      comment.author = user;

      await comment.save();

      return this._commentRepository.findOne({ where: { body: data.body } });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteComment(user: UserEntity, id: number): Promise<ICommentResponse> {
    try {
      const comment = await this._commentRepository.findOne({
        where: { id, 'author.id': user.id },
      });

      await comment.remove();

      return comment;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
