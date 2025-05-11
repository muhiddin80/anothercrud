import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put,Query,UploadedFile,UseGuards,UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "./dtos/create-product";
import { ProductService } from "./products.service";
import { ProductQueryDto } from "./dtos/product.query.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { Protected } from "src/decorators/protected.decorator";
import { Roles } from "src/decorators/role.decorator";
import { UserRoles } from "../users/enums";
import { CheckFileSize, CheckMimetype } from "src/pipes";
import { CheckAuth } from "src/guards/check.token.guard";
import { CheckRolesGuard } from "src/guards/check.role.guard";

@Controller('products')
@UseGuards(CheckAuth,CheckRolesGuard)
export class ProductController {
    constructor(private service:ProductService){}

    @ApiBearerAuth()
    @Get()
    @Protected(false)
    @Roles([UserRoles.ADMIN,UserRoles.USER])
    async getAll(@Query() query:ProductQueryDto){
        return await this.service.getAll(query)
    }

    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('image'))
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Computer', 
          },
          price: {
            type: 'number',
            example: 600,  
          },
          count: {
            type: 'number',  
            example: 6,  
          },
          image: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    @Post()
    async createProduct(@Body() payload:CreateProductDto,
    @UploadedFile(new CheckFileSize(1000000*3),new CheckMimetype(['png','jpg'])) image:Express.Multer.File){
        return this.service.createProduct(payload,image)
    }


    @ApiBearerAuth()
    @Patch(':id')
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async updateProduct(@Body() payload:CreateProductDto,
        @Param('id',ParseIntPipe) id:number){
        return this.service.updateProduct(payload,id)
    }

    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('image'))
    @Put(':id')
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            image: {
              type: 'string',
              format: 'binary'
            }
          }
        }
      })
    async updateImage(@UploadedFile(new CheckFileSize(1000000*3),new CheckMimetype(['png','jpg'])) image:Express.Multer.File,
        @Param('id',ParseIntPipe) id:number){
            return this.service.updateImage(id,image)
        }

    @ApiBearerAuth()
    @Delete(':id')
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async deleteProduct(@Param('id',ParseIntPipe) id:number){
        return await this.service.deleteProduct(id)
    }
}