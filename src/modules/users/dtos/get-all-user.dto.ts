import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum,IsIn, IsOptional, IsPositive, IsString,IsArray } from "class-validator";
import { UserRoles } from "../enums";
import { BadRequestException } from "@nestjs/common";
// import { IsArray } from "sequelize-typescript";

enum sortField {
    name = 'id',
    age = 'age',
}

const acceptedFields = [
    'id',
    'name',
    'age',
    'role',
    'password',
    'createdAt',
    'updatedAt',
    'email',
    'image',
  ];

export class UserQueryDto {
    @ApiProperty({required:false,example:10})
    @Type(()=>Number)
    @IsPositive()
    limit:number;

    @ApiProperty({required:false,example:1})
    @Type(()=>Number)
    @IsPositive()
    page:number;

    @ApiProperty({required:false,example:sortField.age})
    @IsEnum(sortField)
    @IsOptional()
    sortField?:sortField;

    @ApiProperty({required:false,example:'ASC'})
    @IsIn(['ASC','DESC'])
    @IsOptional()
    sortOrder?:'ASC'|'DESC';

    @ApiProperty({
        type:'number',
        required:false,
        minimum:18,
    })
    @Type(()=>Number)
    @IsPositive()
    minAge?:number;

    @ApiProperty({
        type:'number',
        required:false,
        maximum:70,
    })
    @Type(()=>Number)
    @IsPositive()
    maxAge?:number;

    @ApiProperty({
        type:'string',
        enum:UserRoles,
        required:false
    })
    @IsOptional()
    @IsEnum(UserRoles)
    role?:UserRoles;

    @ApiProperty({
        type:'string',
        required:false
    })
    @IsOptional()
    @Transform(({value})=>{
        if(Array.isArray(value)) return value
        if(!value?.length) return acceptedFields
        else {
            const values:string[] = value.split(',')
            const isValid = values.every((el)=>acceptedFields.includes(el))
            if(!isValid) throw new BadRequestException("Column not found!")
            return values;
        }
    })
    @IsArray()
    field?:string[];
}