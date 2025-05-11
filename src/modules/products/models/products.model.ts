import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({tableName:'products',timestamps:true})
export class Products extends Model{
    @Column({type:DataType.STRING})
    name:string;

    @Column({type:DataType.INTEGER})
    price:number;

    @Column({type:DataType.INTEGER})
    count:number;

    @Column({type:DataType.STRING})
    image:string;
}