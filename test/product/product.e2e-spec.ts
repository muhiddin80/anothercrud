import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';
import { Sequelize } from 'sequelize-typescript';
import { ProductModule,Products } from "src/modules";
import { CreateProductDto } from "src/modules/products/dtos/create-product";

describe("Product - e2e", () => {
    let app:INestApplication;
    let sequelize:Sequelize;

    beforeAll(async () => {
        const moduleMixture:TestingModule = await Test.createTestingModule({
            imports:[
                ConfigModule.forRoot({ envFilePath: '.env.test' }),
                SequelizeModule.forRoot({
                  dialect: 'postgres',
                  host: process.env.DB_HOST,
                  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
                  username: process.env.DB_USER,
                  password: process.env.DB_PASSWORD,
                  database: process.env.DB_NAME,
                  synchronize:true,
                  autoLoadModels: true,
                }),
                SequelizeModule.forFeature([Products]),
                ProductModule,
            ],
        }).compile()

        app = moduleMixture.createNestApplication();
        await app.init();

        sequelize = app.get(Sequelize)
    });

    beforeEach(async () => {
        await Products.destroy({where:{},cascade:true,truncate:true})
    });

    afterEach(async () => {
        await Products.destroy({where:{},cascade:true,truncate:true})
    })

    afterAll(async () => {
        if (sequelize) await sequelize.close();
        if (app) await app.close();
        });
    it('GET /product -> should bring all products',async () =>{
        const data:CreateProductDto = {
            name:'Laptop',
            price:700,
            count:5
        }

        const  res = await request(app.getHttpServer())
            .post('/products')
            .send(data)
            .expect(201)

        const response = await request(app.getHttpServer())
            .get('/products')
            .expect(200)

        expect(response.body).toMatchObject({
            message:"Success!"
        })
    })

    it('POST /product -> should create products',async ()=>{
        const data:CreateProductDto = {
            name:'Laptop',
            price:700,
            count:5
        }

        const  res = await request(app.getHttpServer())
            .post('/products')
            .send(data)
            .expect(201)

        expect(res.body).toMatchObject({
            message:"Successfully created!"
        })
    });

    it('PUT /products/:id -> Product ramini yaratadi',async ()=>{
        const data:CreateProductDto = {
            name:'Laptop',
            price:700,
            count:5
        }

        const  res = await request(app.getHttpServer())
            .post('/products')
            .send(data)
            .expect(201)

            // console.log(res.body)
        const productId = res.body.data.id;

        const imagePath = path.join(
            process.cwd(),
            'test',
            'test-files',
            'user.avif',
          );
          console.log(productId)
        const response = await request(app.getHttpServer())
          .put(`/products/${productId}`)
          .attach('image',imagePath)
          .expect(200)

        
        expect(response.body).toMatchObject({
            message: 'Successfully updated!',
        });
    })
    it('DELETE /products/:id -> Productni yoq qivoradi',async () => {
        const data:CreateProductDto = {
            name:'Laptop',
            price:700,
            count:5
        }

        const  res = await request(app.getHttpServer())
            .post('/products')
            .send(data)
            .expect(201)

        // console.log(res.body)
        const productId = res.body.data.id;

        const response = await request(app.getHttpServer())
            .delete(`/products/${productId}`)
            .expect(200)

        expect(response.body).toMatchObject({
            message:"Successfully deleted!"
        })
    })
})