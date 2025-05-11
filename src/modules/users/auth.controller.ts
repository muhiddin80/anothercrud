import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { Protected } from "src/decorators/protected.decorator";
import { Roles } from "src/decorators/role.decorator";
import { UserRoles } from "./enums";

@Controller('auth')
export class AuthController {
    constructor(private service:AuthService){}

    @Post('register')
    @Protected(false)
    @Roles([UserRoles.ADMIN, UserRoles.USER])
    async register(@Body() payload:RegisterDto){
        return await this.service.register(payload)
    }

    @Post('login')
    @Protected(false)
    @Roles([UserRoles.ADMIN, UserRoles.USER])
    async login(@Body() payload:LoginDto){
        return await this.service.login(payload)
    }

}
