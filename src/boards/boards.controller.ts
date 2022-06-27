import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Board } from './board.entity';
import { BoardStatus } from './boards-status.enum';
import { BoardsService } from './boards.service'
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidation } from './pipes/board-status-validation.pipe';

@Controller('boards')
@UseGuards(AuthGuard()) // 여기 쓰면 컨트롤러 전체에 영향
export class BoardsController {
  private logger = new Logger('BoardsController')
  constructor(private boardService:BoardsService) {}

  @Get()
  getAllBoards(
    @GetUser() user: User
  ): Promise<Board[]> {
    this.logger.verbose(`User ${user.username} trying to get all boards.`)
    return this.boardService.getAllBoards(user)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User
  ): Promise<Board> {
    this.logger.verbose(`User ${user.username} create board. Payload : ${JSON.stringify(createBoardDto)}`)
    return this.boardService.createBoard(createBoardDto, user)
  }

  @Get('/:id')
  getBoardById(@Param('id', ParseIntPipe) id:number): Promise<Board> {
    return this.boardService.getBoardById(id)
  }

  @Patch('/:id')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id:number,
    @Body('status', BoardStatusValidation) status: BoardStatus
  ) {
    return this.boardService.updateBoardStatus(id, status)
  }

  @Delete('/:id')
  deleteBoard(
    @Param('id', ParseIntPipe) id,
    @GetUser() user: User
  ): Promise<void> {
    return this.boardService.deleteBoard(id, user)
  }

  // @Get()
  // getAllBoard(): Board[] {
  //   return this.boardService.getAllBoards();
  // }

  // @Post()
  // @UsePipes(ValidationPipe)
  // createBoard(
  //   // @Body('title') title: string,
  //   // @Body('description') description: string
  //   @Body() CreateBoardDto: CreateBoardDto
  //   ): Board {
  //     return this.boardService.createBoard(CreateBoardDto)
  // }

  // @Get('/:id')
  // getBoardById (@Param('id') id: string): Board {
  //   return this.boardService.getBoardById(id)
  // }

  // @Delete('/:id')
  // deleteBoard(@Param('id') id: string): void {
  //   return this.boardService.deleteBoard(id)
  // }

  // @Patch('/:id')
  // updateBoardStatus (
  //   @Param('id') id: string,
  //   @Body('status', BoardStatusValidation) status: BoardStatus
  // ) {
  //   return this.boardService.updateBoardStatus(id, status)
  // }
}
