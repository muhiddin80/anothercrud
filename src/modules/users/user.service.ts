import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./model/user.model";
import { CreateUserDto } from "./dtos";
import  * as bcrypt from "bcryptjs"
import { UpdateUserDto } from "./dtos/update-user.dto";

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private UserModel:typeof User){}

    async getAll(){
        const users = await this.UserModel.findAll()
        return {
            message:"Success!",
            data:users,
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
            message:"Succcessfully created!",
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
        {where:{id:id}})
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
}