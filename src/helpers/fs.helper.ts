import { BadRequestException, Injectable } from "@nestjs/common";
import { existsSync } from "node:fs";
import * as path from "node:path";
import * as fs from "node:fs";
import * as fsPromise from "node:fs/promises"

@Injectable()
export class FsHelper {
    async uploadFile(file:Express.Multer.File){
        const fileHolder = path.join(process.cwd(),"uploads");

        if(!fs.existsSync(fileHolder)){
            fs.mkdirSync(fileHolder,{recursive:true})
        }

        let fileName = `${Date.now()}-file.${file.originalname.split('.')[1]}`;

        await fsPromise.writeFile(path.join(fileHolder,fileName),file.buffer);
        return fileName
    }

    async deleteFile(name:string){
        let filePath = path.join(process.cwd(),'uploads',name);

        if(!fs.existsSync(filePath)){
            throw new BadRequestException('This file does not exist!')
        }
        await fsPromise.unlink(filePath);
        return {
            message:"success"
        }
    }
}