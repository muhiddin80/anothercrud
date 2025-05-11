import { IsString, MinLength,IsEmail, MaxLength, IsPositive } from "class-validator";
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({required:true,example:'example@gmail.com'})
    @IsEmail()
    email:string;

    @ApiProperty({required:true,example:'example'})
    @IsString()
    @MinLength(4)
    @MaxLength(12)
    password:string;
}