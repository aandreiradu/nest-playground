import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../../src/auth/decorator';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  createBookmark(
    @GetUser('id') userId: string,
    @Body() dto: CreateBookmarkDTO,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Get()
  getBookmarks(@GetUser('id') userId: string) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: string,
    @Param('id') bookmarkId: string,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Patch('id')
  editBookmarkById(
    @GetUser('id') userId: string,
    @Body() dto: EditBookmarkDTO,
    @Param('id') bookmarkId: string,
  ) {
    this.editBookmarkById(userId, dto, bookmarkId);
  }

  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: string,
    @Param('id') bookmarkId: string,
  ) {}
}
