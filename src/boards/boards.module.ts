import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Board } from './board.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Board
      // BoardRepository
    ]),
    AuthModule // authmodule 쓰려면 여기서 import 해야함
  ],
  controllers: [BoardsController],
  providers: [BoardsService]
})
export class BoardsModule {}
