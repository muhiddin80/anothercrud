import { FsHelper } from "src/helpers";
import { User } from "./model";
import { UserModule } from "./user.module";
import { UserService } from "./user.service"
import { count } from "console";
import { UserQueryDto } from "./dtos/get-all-user.dto";
import { CreateUserDto } from "./dtos";
import { UserRoles } from "./enums";
import * as bcrypt from "bcryptjs"
import { UpdateUserDto } from "./dtos/update-user.dto";

describe('UserService unit test',()=>{
    let service:UserService;
    let userModel:any = {
        findAndCountAll:jest.fn().mockResolvedValue({count:1,rows:[]}),
        create:jest.fn()
    }
    let fsHelper:FsHelper={
        deleteFile:jest.fn(),
        uploadFile:jest.fn(),
    }

    beforeAll(()=>{
        service=new UserService(userModel)
    })

    it('service defined',()=>{
        expect(service).toBeDefined()
    })

    it('getAll',async ()=>{
        const query:UserQueryDto= {
            limit:5,
            page:1,
        }
        const res = await service.getAll(query);

        expect(res).toBeInstanceOf(Object);
        expect(res.count).toBe(1)
        expect(res.limit).toEqual(5)
    });

    it('create',async ()=>{
        const createUserData:CreateUserDto = {
            age:22,
            email:'tomas@gmail.com',
            name:"tomas",
            password:'tomas123',
            // role:UserRoles.ADMIN
        };
        const passHash = bcrypt.hashSync(createUserData.password);
        userModel.findOne = jest.fn().mockResolvedValue(undefined);

        userModel.create = jest
            .fn()
            .mockResolvedValue({...createUserData,password:passHash})

        const res = await service.createUser({...createUserData,password:passHash})

        expect(res.message).toEqual("Successfully created!");
        expect(res.data).toBeInstanceOf(Object);
        expect(res.data.name).toEqual(createUserData.name)
        expect(res.data.email).toEqual(createUserData.email)
        expect(res.data.age).toEqual(createUserData.age)
        expect(res.data.password).toBeTruthy()
        expect(res.data.password).toEqual(passHash)
    });

    it('updateUser', async () => {
        const userId = 1;
        const updateUserData: UpdateUserDto = {
            age: 22,
            name: "tomas",
            password: 'tomas123',
        };
    
        const existingData = {dataValues:{
            id:userId,
            age: 22,
            name: "heelo",
            password: 'iamsmart',
            email: 'smart@gmail.com'
        }};
    
        const passHash = bcrypt.hashSync(updateUserData.password);
    
        const updated = {
            age: 22,
            name: 'tomas',
            password: passHash,
            email: 'smart@gmail.com'
        };
    
        userModel.findOne = jest.fn().mockResolvedValue(existingData);
    
        userModel.update = jest.fn().mockResolvedValue([1, [updated]]);
    
        const res = await service.updateUser(updateUserData, userId);

        expect(res.message).toEqual('Successfully updated!');
    
        expect(res.data).toEqual([userId,[updated]]);
    });

    it('deleteUser',async ()=>{
        const userId = 1
        const existingData = {dataValues:{
            id:userId,
            age: 22,
            name: "heelo",
            password: 'iamsmart',
            email: 'smart@gmail.com'
        }};

        userModel.findOne = jest.fn().mockResolvedValue(existingData);

        userModel.destroy = jest.fn().mockResolvedValue(userId)

        const res = await service.deleteUser(userId)

        expect(res.message).toEqual('Successfully deleted!')
        expect(res.data).toEqual(userId)
    })

})
    