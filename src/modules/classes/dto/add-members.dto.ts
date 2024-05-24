import { IsUUID } from 'class-validator';

export class AddMembersDto {
  @IsUUID(4, { each: true })
  memberIds: string[];
}
