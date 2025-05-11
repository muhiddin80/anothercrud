import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {User} from "./model"
import {JwtService} from "@nestjs/jwt"
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from "bcryptjs"
import { LoginDto } from "./dtos/login.dto";
import { JwtHelper } from "src/helpers";

@Injectable()
export class AuthService {
    constructor(@InjectModel(User) private userModel:typeof User,
    private JwtService:JwtService,
    private JwtHelper:JwtHelper){}

    async login(payload:LoginDto){
        const foundedUser = await this.userModel.findOne({
            where:{email:payload.email}
        });

        if(!foundedUser){
            throw new ConflictException('User with this email does not exist!')
        }

        let isMatch = await bcrypt.compare(payload.password,foundedUser.dataValues.password)

        if(!isMatch){
            throw new BadRequestException("Invalid password!");
        }
        // console.log(foundedUser.dataValues)
    
        const {token} = await this.JwtHelper.generateToken({id:foundedUser.id,role:foundedUser.dataValues.role})
        return {
            message:"Successfully logged!",
            token,
            data:foundedUser.dataValues
        }
    }

    async register(payload:RegisterDto){
        const foundedUser = await this.userModel.findOne({
            where:{email:payload.email}
        });

        if(foundedUser){
            throw new ConflictException('User with this email is already exist!')
        }

        const passHash = bcrypt.hashSync(payload.password);

        const user = await this.userModel.create({
            email:payload.email,
            name:payload.name,
            age:payload.age,
            password:passHash,
        });

        return {
            message:"Successfully registered!",
            data:user.dataValues
        }
    }
}