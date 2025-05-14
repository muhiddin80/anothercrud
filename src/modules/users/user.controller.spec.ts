import { get } from "http";
import { UserController } from "./user.controller"
import { UserQueryDto } from "./dtos/get-all-user.dto";
import { CreateUserDto } from "./dtos";
import { UpdateUserDto } from "./dtos/update-user.dto";

describe("UserController",()=>{
    let controller:UserController;
    let service:any = {
        getall:jest.fn(),
        createUser:jest.fn(),
        updateUser:jest.fn(),
        deleteUser:jest.fn()
    };

    beforeEach(()=>{
        controller = new UserController(service)
        jest.clearAllMocks();
    })
    it('GET ->/users',async () =>{
        service.getAll = jest.fn().mockResolvedValue({
            count:1,
            limit:10,
            page:1,
            data:[]
        });
        const queries:UserQueryDto = {limit:10,page:1};
        const res = await controller.getAll(queries);

        expect(res.count).toEqual(1)
        expect(res.limit).toEqual(10)
        expect(res.page).toEqual(1)
        expect(res.data).toEqual([])
    })

    it('POST ->/users',async () =>{
        service.createUser = jest.fn().mockResolvedValue({
            message: "Successfully created!",
            data: {
                name: 'Someone',
                email: 'someone@gmail.com',
                password: 'someone',
                age: 22
            }
        })
        const payload:CreateUserDto = {name:'Someone',
            email:'someone@gmail.com',
            password:'someone',
            age:22}
        const res = await controller.createNew(payload)
        // console.log(res)
        expect(res.data).toEqual(payload)
        expect(res.message).toEqual("Successfully created!")
    })

    it('PATCH ->/users/id',async ()=>{
        service.updateUser = jest.fn().mockResolvedValue({
            message: "Successfully updated!",
            data: {
                name: 'Someone',
                email: 'someone@gmail.com',
                password: 'someone',
                age: 22
            }
        })
        const payload:UpdateUserDto = {name:'Someone',
            password:'someone',
            age:22}
        const userId = 1
        const res = await controller.updateUser(payload,userId)

        // console.log(res)
        expect(res.data).toEqual({...payload,email:'someone@gmail.com'})
        expect(res.message).toEqual("Successfully updated!")
    })
    
    it('DELETE ->/users/id',async ()=>{
        service.deleteUser = jest.fn().mockResolvedValue({
            message:"Successfully deleted!",
            data:[1]
        })
        const userId = 1;

        const res = await controller.deleteUser(userId);
        console.log(res)

        expect(res.data).toEqual([1])
        expect(res.message).toEqual('Successfully deleted!')
    })
})