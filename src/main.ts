require("dotenv").config();
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { debugLog, logger } from "./shared/logger";
import * as fs from "fs";
import { ValidationPipe } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as session from 'express-session';

const express = require("express");

async function bootstrap() {
  let app = null;

  if (
    process.env.NODE_ENV !== "dev-api" &&
    process.env.NODE_ENV !== "prod-api"
  ) {
    debugLog(`NODE_ENV set to dev-api`);
  }
  const expressApp = express();
  app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  const options = new DocumentBuilder()
    .setTitle("Example APIs")
    .setDescription("Example APIs")
    .setVersion("1.0")
    .addBearerAuth(
      {
        description: "Bearer *token*",
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
      "JWT"
    )
    .addSecurityRequirements("JWT")
    .build();

  if (process.env.NODE_ENV !== "prod-api") {
    const document = SwaggerModule.createDocument(app, options);
    writeSwaggerJson(`${process.cwd()}`, document);
    SwaggerModule.setup("docs", app, document);
  }

  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  
  app.use("/ipfs", express.static("ipfs"), function (req, res) {
    res.status(404);
    res.json({ error: { code: 404 } });
  });

  app.use(logger);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({}));

  await app.init();

  const server = http.createServer(expressApp);
  server.listen(process.env.PORT || 3000);

  debugLog(
    `Application is running on: ${process.env.PORT || 3000} and ${
      process.env.HTTPS_PORT || 443
    }`
  );
}
bootstrap();

export const writeSwaggerJson = (path: string, document: any) => {
  fs.writeFileSync(`${path}/swagger.json`, JSON.stringify(document, null, 2), {
    encoding: "utf8",
  });
};
