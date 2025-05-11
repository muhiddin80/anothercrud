import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:false,
    })
  )
  const config = new DocumentBuilder()
    .setTitle('User Api')
    .setDescription("Crud for user")
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api',app,documentFactory);
  // console.log(process.env.ACCESS_TOKEN_SECRET)
  
  let Port = process.env.APP_PORT? parseInt(process.env.APP_PORT) : 3000;
  await app.listen(Port,()=>{
    console.log(`http://localhost:${Port}`)
  });
}
bootstrap();
