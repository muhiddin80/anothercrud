import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./model/user.model";
import { CreateUserDto } from "./dtos";
import  * as bcrypt from "bcryptjs"
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserQueryDto } from "./dtos/get-all-user.dto";
import { Op } from "sequelize";
import { link } from "fs";
import { UserRoles } from "./enums";

@Injectable()
export class UserService implements OnModuleInit{
    constructor(@InjectModel(User) private UserModel:typeof User){}
    async onModuleInit() {
        await this.seedUsers()
    }

    async getAll(queries:UserQueryDto){
        let filters:any = {};
        if(queries.minAge){
            filters.age = {
                [Op.gte]: queries.minAge
            }
        }
        if(queries.maxAge){
            filters.age = {
                ...filters.age,
                [Op.lte]:queries.maxAge
            }   
        }

        if(queries.role){
            filters.role = {
                [Op.eq]:queries.role
            }
        }
        const {count,rows:users} = await this.UserModel.findAndCountAll({
            limit:queries.limit||10,
            offset:(queries.page-1)*queries.limit||0,
            order:queries.sortField? [[queries.sortField,queries.sortOrder||'DESC']] : [['id','ASC']],
            where:{...filters},
            attributes:queries.field
        })
        return {
            count:count,
            message:"Success!",
            data:users,
            limit:queries.limit,
            page:queries.page
        }
    }

    async createUser(payload:CreateUserDto){
        const founded = await this.UserModel.findOne({where:{email:payload.email}})

        if(founded?.dataValues){
            throw new BadRequestException("User with this email is already exist!");
        }

        const passwordHash = bcrypt.hashSync(payload.password)

        const user = await this.UserModel.create({
            email:payload.email,
            name:payload.name,
            age:payload.age,
            password:passwordHash
        })
        return {
            message:"Successfully created!",
            data:user,
        }
    }

    async updateUser(payload:UpdateUserDto,id:number){
        const founded = await this.UserModel.findOne({where:{id:id}})

        if(!founded?.dataValues){
            throw new BadRequestException("User with this email does not exist!");
        }

        const passwordHash = bcrypt.hashSync(payload.password)

        const updatedUser = await this.UserModel.update({            
            name:payload.name||founded.dataValues.name,
            age:payload.age || founded.dataValues.age,
            password:passwordHash || founded.dataValues.password,
        },
        {where:{id:id},
        returning:true})
        return {
            message:"Successfully updated!",
            data:updatedUser
        }
};



    async deleteUser(id:number){
        const founded = await this.UserModel.findOne({where:{id:id}})

        if(!founded?.dataValues){
            throw new BadRequestException("User with this email does not exist!");
        }

        const deletedUser = await this.UserModel.destroy({where:{id:id}})

        return {
            message:"Successfully deleted!",
            data:deletedUser
        }
    }

    async seedUsers() {
        const defaultUsers = [
          {
            name: 'example',
            age: 25,
            email: 'example@gmail.com',
            password: 'example',
            role: UserRoles.ADMIN,
          },
        ];
    
        for (let user of defaultUsers) {
          const foundedUser = await this.UserModel.findOne({
            where: { email: user.email },
          });
    
          if (!foundedUser) {
            const passHash = bcrypt.hashSync(user.password);
            await this.UserModel.create({
              name: user.name,
              role: user.role,
              age: user.age,
              email: user.email,
              password: passHash,
            });
          }
        }
        console.log("Example admini yaratildi")
    }
}