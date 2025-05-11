import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CheckMimetype implements PipeTransform{
    mimetype:string[]
    constructor(mimetype:string[]){
        this.mimetype=mimetype
    }
    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
        if(!this.mimetype.includes(value.originalname.split('.').at(-1) as string)){
            throw new BadRequestException('You must only send jpg and png files!')
        }
        return value;
    }
}
