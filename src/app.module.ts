import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModule, UserModule } from './modules';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
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
})
export class AppModule {}
