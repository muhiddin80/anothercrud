import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { UserRoles } from "src/modules/users/enums";

@Injectable()
export class JwtHelper {
    constructor(private jwt:JwtService){}

    async generateToken(payload:{id:number,role:UserRoles}){
        const token = await  this.jwt.signAsync(payload)

        return {token};
    }

    async verifyToken(token:string){
        try {
            const decodedData = await this.jwt.verifyAsync(token)  
            return decodedData;
        } catch (error) {
            if(error instanceof TokenExpiredError){
                throw new ForbiddenException("Token expired!")
            }

            if(error instanceof JsonWebTokenError){
                throw new BadRequestException("Invalid or expired Token!")
            }

            throw new InternalServerErrorException("Internal server error!")
        }
    }
}