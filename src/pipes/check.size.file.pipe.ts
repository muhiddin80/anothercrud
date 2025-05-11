import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CheckFileSize implements PipeTransform{
    size:number
    constructor(size:number){
        this.size=size
    }

    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
        if(this.size<value.size){
            throw new BadRequestException("Send file with smaller size!")
        }
        return value;
    }
}