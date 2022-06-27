import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as config from 'config';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'), // jwt가 유효한지 체크할 때 사용
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // jwt를 헤더의 Authorization에서 찾고 Bearer token으로 전달한다는 뜻
    })
  }

  // 위에서 토큰이 유효한지 체크가 되면 validate 메소드에서 payload에 있는 유저이름이 데이터베이스에 있는지 확인
  // return 값은 @UserGuards(AuthGuard())를 이용한 모든 요청의 Request Object에 들어감
  async validate(payload) {
    const {username} = payload
    console.log('payload : ', payload)
    const user: User = await this.userRepository.findOne({
      where: {
        username
      }
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}