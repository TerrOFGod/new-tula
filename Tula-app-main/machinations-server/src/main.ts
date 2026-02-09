import { NestFactory } from "@nestjs/core"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix("api")
	app.enableCors({
		origin: [`http://localhost:${process.env.HOST_PORT ?? 3000}`],
		credentials: true,
	})

	const config = new DocumentBuilder()
		.setTitle("Tula API")
		.setDescription(
			"API for collabarative board for create game simulation's schemas",
		)
		.setVersion("1.0")
		.addTag("tula")
		.build()

	const documentFactory = () => SwaggerModule.createDocument(app, config)

	SwaggerModule.setup("swagger", app, documentFactory, {
		jsonDocumentUrl: "swagger/json",
	})

	await app.listen(process.env.HOST_PORT ?? 3000)
}
bootstrap()
