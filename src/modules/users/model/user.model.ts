import { Module } from "@nestjs/common";
import { AllowNull, Column, DataType, Model, Table } from "sequelize-typescript";
import { UserRoles } from "../enums";

@Table({tableName:'users',timestamps:true})
export class User extends Model{
    @Column({})
    name:string;
    
    @Column({type: DataType.SMALLINT,allowNull:true})
    age:number;

    @Column({})
    email:string;

    @Column({allowNull:true})
    password:string;

    @Column({type:DataType.ENUM,values:Object.values(UserRoles),defaultValue:UserRoles.USER})
    role:UserRoles;
}
