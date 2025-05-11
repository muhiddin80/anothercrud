import { IsString, MinLength,IsEmail, MaxLength, IsPositive } from "class-validator";
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({required:true,example:'example'})
    @IsString()
    name:string;

    @ApiProperty({required:true,example:'example'})
    @IsString()
    @MinLength(4)
    @MaxLength(12)
    password:string;

    @ApiProperty({required:true,example:18})
    @Type(()=>Number)
    @IsPositive()
    age:number;
}