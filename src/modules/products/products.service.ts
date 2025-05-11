import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Products } from "./models";
import { CreateProductDto } from "./dtos/create-product";
import { FsHelper } from "src/helpers";
import { ProductQueryDto } from "./dtos/product.query.dto";

@Injectable()
export class ProductService {
    constructor(@InjectModel(Products) private ProductModel:typeof Products,
        private fs:FsHelper){}

    async getAll(query:ProductQueryDto){
        let limit = query.limit||10;
        let page = query.page||1;
        let offset = (page-1)*limit;
        let sortField = query.sortField||'price';
        let sortOrder = query.sortOrder||'ASC';
        const products = await this.ProductModel.findAll({limit:limit,offset:offset,order:[[sortField,sortOrder]]})

        return {
            message:"Success!",
            data:products,
        }
    }

    async createProduct(payload:CreateProductDto,image:Express.Multer.File){
        const founded = await this.ProductModel.findOne({where:{name:payload.name}})
        if(founded){
            throw new BadRequestException("This product is already exists!");
        }
        let imageName:string = ''
        if(image){
            imageName = await this.fs.uploadFile(image)
        }

        const newProduct = await this.ProductModel.create({
            name:payload.name,
            price:payload.price,
            count:payload.count,
            image:imageName
        })
        
        return {
            message:"Successfully created!",
            data:newProduct
        }
    }
    
    async updateProduct(payload:CreateProductDto,id:number){
        const founded = await this.ProductModel.findOne({where:{name:payload.name}})
        if(!founded){
            throw new BadRequestException("This product does not exist!");
        }

        const updatedProduct = await this.ProductModel.update({
            name:payload.name||founded.dataValues.name,
            price:payload.price||founded.dataValues.price,
            count:payload.count||founded.dataValues.count
        },{where:{id:id}})

        return {
            message:"Successfully updated!",
            data:updatedProduct
        }
    }

    async updateImage(id:number,image:Express.Multer.File){
        const founded = await this.ProductModel.findOne({where:{id:id}})
        if(!founded){
            throw new BadRequestException("This product does not exist!");
        }
        await this.fs.deleteFile(founded.dataValues.image)

        let imageName:string = '';
        if(image){
            imageName = await this.fs.uploadFile(image)
        }

        const updateImage = await this.ProductModel.update(
            {image:imageName},
            {where:{id:id}}
        )

        return {
            message:"Successfully updated!",
            data:updateImage
        }
    }

    async deleteProduct(id:number){
        const founded = await this.ProductModel.findOne({where:{id:id}})
        if(!founded){
            throw new BadRequestException("This product does not exist!");
        }

        await this.fs.deleteFile(founded.dataValues.image)

        const deletedProduct = await this.ProductModel.destroy({
            where:{id:id}
        })

        return {
            message:"Successfully deleted!",
            data:deletedProduct
        }
    }
}