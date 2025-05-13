import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModule, UserModule } from './modules';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from "node:path"
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/exception.filter';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(),'uploads'),
      serveRoot:'/uploads'
    }),
    SequelizeModule.forRoot({
      dialect:"postgres",
      host:process.env.DB_HOST,
      port:process.env.DB_PORT? parseInt(process.env.DB_PORT) : 5432,
      username:process.env.DB_USER,
      password:process.env.DB_PASSWORD,
      database:process.env.DB_NAME,
      synchronize:true,
      autoLoadModels:true,   
    }),
    UserModule,
    ProductModule
  ],
  providers:[
    {
      provide:APP_FILTER,
      useClass:HttpExceptionFilter
    }
  ]
})
export class AppModule {}
