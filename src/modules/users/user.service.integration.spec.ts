import { ConfigModule } from "@nestjs/config";
import { UserService } from "./user.service"
import {Test, TestingModule} from "@nestjs/testing"
import { Sequelize } from "sequelize";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./model";
import { FsHelper } from "src/helpers";
import { CreateUserDto } from "./dtos";
import { BadRequestException } from "@nestjs/common";
import { UpdateUserDto } from "./dtos/update-user.dto";
import * as bcrypt from "bcryptjs"

describe("UserService - Integration",()=>{
    let service:UserService;

    beforeAll(async () => {
        const moduleMixture: TestingModule =await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ envFilePath: '.env.test' }),
                SequelizeModule.forRoot({
                    dialect: "postgres",
                    host: process.env.DB_HOST,
                    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
                    username: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    synchronize: true,
                    autoLoadModels: true,
                }),
                SequelizeModule.forFeature([User]),
            ],
            providers:[UserService,FsHelper],
        }).compile();

        service = moduleMixture.get<UserService>(UserService)
    })
    beforeEach(async ()=>{
        await User.destroy({where:{},truncate:true,cascade:true})
    });

    afterAll(async ()=>{
        await User.sequelize?.close()
    });

    it('Get all users (INTEGRATION)',async () =>{
        const data :CreateUserDto = {
            age:19,
            email:'ali@gmail.com',
            name:'Ali',
            password:'ali123'
        }

        await service.createUser(data)

        const res = await service.getAll({limit:10,page:1})

        expect(res.count).toEqual(1)
        expect(res.data).toHaveLength(1)
        expect(res.data[0]).toHaveProperty('id')
    })
    it('Create user', async ()=>{
        const data:CreateUserDto = {
            age:19,
            email:'ali@gmail.com',
            name:'Ali',
            password:'ali123'
        };

        try {
            await service.createUser(data)
            await service.createUser(data)
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException)
            expect(error.message).toEqual("User with this email is already exist!")
        }
    })

    it('Update user catching error',async () =>{
        const data:UpdateUserDto = {
            age:22,
            name:'Ali',
            password:'ali123'
        }
        let userid:number=1

        try {
            await service.updateUser(data,userid)
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException)
            expect(error.message).toEqual('User with this email does not exist!')
        }
    })

    it('Update user ',async ()=>{
        const dataUser:CreateUserDto = {
            age:19,
            email:'ali@gmail.com',
            name:'Ali',
            password:'ali123'
        };

        const data:UpdateUserDto = {
            age:22,
            name:'Ali',
            password:'ali123'
        }

        let newUser = await service.createUser(dataUser)
        const res = await service.updateUser(data,newUser.data.dataValues.id)
        expect(res.message).toEqual("Successfully updated!")
    })

    it('Delete user',async () =>{
        const dataUser:CreateUserDto = {
            age:19,
            email:'ali@gmail.com',
            name:'Ali',
            password:'ali123'
        };

        let newUser = await service.createUser(dataUser)
        const res = await service.deleteUser(newUser.data.dataValues.id)
        expect(res.message).toEqual('Successfully deleted!')
    })
})