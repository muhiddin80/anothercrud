import { BadRequestException } from "@nestjs/common"
import { UserController } from "./user.controller"
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./model";
import { FsHelper } from "src/helpers";
import { UserService } from "./user.service";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "./dtos";
import { UpdateUserDto } from "./dtos/update-user.dto";

describe('UserController - Integration',()=>{
    let controller:UserController;
    beforeAll(async () =>{
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
            controllers:[UserController],
            providers:[UserService,FsHelper],
        }).compile();

        controller = moduleMixture.get<UserController>(UserController);
    })
    beforeEach(async () => {
        await User.destroy({where:{},truncate:true,cascade:true})
    });

    afterEach(async ()=>{
        await User.destroy({where:{},truncate:true,cascade:true})
    })

    afterAll(async ()=>{
        await User.sequelize?.close()
    })

    it('GET /Users -> Get all users',async () =>{
        const data:CreateUserDto ={
            age:10,
            name:"Ali",
            email:'ali@gmail.com',
            password:'ali123'
        }

        await controller.createNew(data);

        const res = await controller.getAll({limit:10,page:1})

        expect(res.count).toEqual(1)
    })

    it('POST /User -> create new user', async () => {
        const data:CreateUserDto = {
            age:10,
            name:"Ali",
            email:'ali@gmail.com',
            password:'ali123'
        }

        try { 
            await controller.createNew(data)
            await controller.createNew(data)
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException)
            expect(error.message).toEqual('User with this email is already exist!')
        }
    })

    it('PATCH /User -> update user', async () => {
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

        let newUser = await controller.createNew(dataUser)
        const res = await controller.updateUser(data,newUser.data.dataValues.id)
        expect(res.message).toEqual("Successfully updated!")
    })

    it('DELETE /User -> delete user',async () =>{
        const dataUser:CreateUserDto = {
            age:19,
            email:'ali@gmail.com',
            name:'Ali',
            password:'ali123'
        };

        let newUser = await controller.createNew(dataUser)
        const res = await controller.deleteUser(newUser.data.dataValues.id)
        expect(res.message).toEqual('Successfully deleted!')
    })
})