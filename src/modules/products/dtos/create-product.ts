import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsPositive, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({required:true,example:'Computer'})
    @IsString()
    name:string;

    @ApiProperty({required:true,example:600})
    @Type(()=>Number)
    @IsPositive()
    price:number;

    @ApiProperty({required:true,example:6})
    @Type(()=>Number)
    @IsPositive()
    count:number;
}