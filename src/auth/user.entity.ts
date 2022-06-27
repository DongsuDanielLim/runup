import { Board } from "src/boards/board.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcryptjs'

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  // user가 N개의 게시글을 쓸 수 있으므로 Board[]
  // type : Board
  // board => board.user : 싱대방이 접근하려면 어떻게 해야하느냐, Board 에서 User에 접근하려면 board의 user컬럼으로 접근
  // {eager: true} : user 가져올 때 board도 같이 가져올거면 true
  @OneToMany(type => Board, board => board.user, { eager: true })
  boards: Board[];

  async validatePassword(password: string): Promise<boolean> {
    let isValid = await bcrypt.compare(password, this.password)
    return isValid
  }
}