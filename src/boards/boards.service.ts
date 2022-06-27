import {v1 as uuid} from 'uuid'
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
  // @InjectRepository - 서비스를 컨트롤러에 injection하는 것과 다르게 리파지토리 인젝션은 이걸 써야함
  // 이 서비스에서 BoardRepository를 이용한다는 것을 
  // boardRepository 변수에 넣어줌
  // 암묵적으로 프로퍼티로 선언됨
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>
  ) {}

  async getAllBoards (user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board')
    query.where('board.userId = :userId', { userId: user.id })
    const boards = await query.getMany()
    return boards
    // return this.boardRepository.find()
  }

  async getBoardById (id:number) : Promise<Board> {
    const found = await this.boardRepository.findOne({
      where: {
        id
      }
    })

    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`)
    }
    return found
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User
  ): Promise<Board> {
    const {title, description} = createBoardDto

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user
    })

    await this.boardRepository.save(board)
    return board
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id)
    board.status = status
    await this.boardRepository.save(board)
    return board
  }

  async deleteBoard(
    id: number,
    user: User
  ): Promise<void> {
    console.log('user : ', user)
    const result = await this.boardRepository.delete({id})

    if (result.affected === 0) {
      throw new NotFoundException(`Can't not found board id ${id}`)
    }
  }


  // private boards: Board[] = [];

  // getAllBoards (): Board[] {
  //   return this.boards;
  // }

  // createBoard (
  //   // title: string, description: string
  //   createBoardDto: CreateBoardDto
  //   ) {
  //   const {title, description} = createBoardDto
  //   const board: Board = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: BoardStatus.PUBLIC
  //   }

  //   this.boards.push(board)
  //   return board
  // }

  // getBoardById (id: string): Board {
  //   const found = this.boards.find((board) => board.id === id)

  //   if (!found) {
  //     throw new NotFoundException(`Can't find Board with id ${id}`)
  //   }

  //   return found;
  // }

  // deleteBoard (id: string): void {
  //   const found = this.getBoardById(id)
  //   this.boards = this.boards.filter((board) => board.id !== found.id)
  // }

  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id)
  //   board.status = status
  //   return board
  // }
}
