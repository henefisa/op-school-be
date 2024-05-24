import { IsUUID } from 'class-validator';

export class RemoveMembersDto {
  @IsUUID(4, { each: true })
  memberIds: string[];
}
