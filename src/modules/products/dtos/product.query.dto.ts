import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum,IsIn, IsPositive } from "class-validator";

enum sortField {
    name = 'name',
    price='price',
    count='count',
}

export class ProductQueryDto {
    @ApiProperty({required:false,example:10})
    @Type(()=>Number)
    @IsPositive()
    limit:number;

    @ApiProperty({required:false,example:1})
    @Type(()=>Number)
    @IsPositive()
    page:number;

    @ApiProperty({required:false,example:sortField.price})
    @IsEnum(sortField)
    sortField:sortField;

    @ApiProperty({required:false,example:'ASC'})
    @IsIn(['ASC','DESC'])
    sortOrder:'ASC'|'DESC';
}