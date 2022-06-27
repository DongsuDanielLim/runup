import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../boards-status.enum";

export class BoardStatusValidation implements PipeTransform {
  // 외부 접근은 가능하지만 변경 불가능
  readonly StatusOptions = [
     BoardStatus.PRIVATE,
     BoardStatus.PUBLIC
  ]

  transform(value: any, metadata: ArgumentMetadata) {
    console.log('value : ', value)

    value = value.toUpperCase()

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} isn't in the status.`)
    }
    return value
  }

  private isStatusValid (status: any) {
    return this.StatusOptions.indexOf(status) !== -1
  }
}