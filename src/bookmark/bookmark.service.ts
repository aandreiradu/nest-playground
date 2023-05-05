import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: string, dto: CreateBookmarkDTO) {
    try {
      await this.prisma.bookmark.create({
        data: {
          ...dto,
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async getBookmarks(userId: string) {
    try {
      return await this.prisma.bookmark.findMany({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async getBookmarkById(userId: string, bookmarkId: string) {
    try {
      return await this.prisma.bookmark.findFirst({
        where: {
          userId: userId,
          id: bookmarkId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async editBookmarkById(
    userId: string,
    dto: EditBookmarkDTO,
    bookmarkId: string,
  ) {
    try {
      return await this.prisma.bookmark.update({
        where: {
          id: bookmarkId,
        },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  deleteBookmarkById(userId: string, bookmarkId: string) {}
}
