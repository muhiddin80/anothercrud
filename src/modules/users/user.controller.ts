import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Protected } from "src/decorators/protected.decorator";
import { Roles } from "src/decorators/role.decorator";
import { UserRoles } from "./enums";
import { CheckAuth } from "src/guards/check.token.guard";
import { CheckRolesGuard } from "src/guards/check.role.guard";

@Controller('users')
@UseGuards(CheckAuth,CheckRolesGuard)
export class UserController{
    constructor(private service:UserService){}
    @ApiBearerAuth()
    @Get()
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async getAll(){
        return this.service.getAll()
    }

    @ApiBearerAuth()
    @Post()
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async createNew(@Body() payload:CreateUserDto){
        return this.service.createUser(payload)
    }

    @ApiBearerAuth()
    @Patch(':id')
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async updateUser(@Body() payload:UpdateUserDto,
                @Param('id',ParseIntPipe) id:number){
        return this.service.updateUser(payload,id)
    }

    @ApiBearerAuth()
    @Delete(':id')
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async deleteUser(@Param('id', ParseIntPipe) id:number){
        return this.service.deleteUser(id)
    };
}