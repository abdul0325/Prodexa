import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;

  @IsUrl({}, { message: 'repoUrl must be a valid URL' })
  @IsNotEmpty({ message: 'Repository URL is required' })
  repoUrl: string;

  @IsString()
  @IsNotEmpty({ message: 'Owner name is required' })
  ownerName: string;
}
