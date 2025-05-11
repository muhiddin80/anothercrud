import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./model";
import { JwtHelper } from "src/helpers";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports:[ConfigModule.forRoot({
              isGlobal:true
            }),SequelizeModule.forFeature([User]),
    JwtModule.register({
        global:true,
        secret:process.env.ACCESS_TOKEN_SECRET,
        signOptions:{
            expiresIn:process.env.ACCESS_TOKEN_TIME? parseInt(process.env.ACCESS_TOKEN_TIME):'1h'
        },
    })],
    providers:[UserService,AuthService,JwtHelper],
    controllers:[UserController,AuthController],
})

export class UserModule {}