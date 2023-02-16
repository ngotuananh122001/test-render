require("dotenv").config();
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { debugLog, logger } from "./shared/logger";
import * as fs from "fs";
import { ValidationPipe } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as http from "http";
import * as https from "https";
import * as bodyParser from "body-parser";
const express = require("express");

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.TYPEORM_HOST", process.env.TYPEORM_HOST);
console.log("process.env.TYPEORM_PORT", process.env.TYPEORM_PORT);
console.log("process.env.TYPEORM_USERNAME", process.env.TYPEORM_USERNAME);
console.log("process.env.TYPEORM_PASSWORD", process.env.TYPEORM_PASSWORD);


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

  app.use("/ipfs", express.static("ipfs"), function (req, res) {
    // Optional 404 handler
    res.status(404);
    res.json({ error: { code: 404 } });
  });

  app.use(logger);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({}));

  await app.init();

  const server = http.createServer(expressApp);

  // Set up socket io
  // const socketIO = require("socket.io")(server, {
  //   cors: {
  //     origin: "http://localhost:3000",
  //   },
  // });

  // socketIO.on("connection", (socket) => {
  //   console.log(`⚡: ${socket.id} user just connected!`);

  //   socket.on('join_room', (data) => {
  //     const { username, room } = data; // Data sent from client when join_room event emitted
  //     socket.join(room); // Join the user to a socket room
  //   });

  //   socket.on('lock', (lock) => {
  //     console.log('🔒: lock', lock)

  //     // update db
  //     // emit to all users in room
  //     lock.isLocked = lock.isLocked === 1 ? 0 : 1;
  //     socketIO.emit('lock-event', lock)
  //   });

  //   socket.on('update', (data) => {
  //     console.log('🔒: update', data)
  //     socketIO.emit('update-event', data)
  //   })

  //   socket.on("disconnect", () => {
  //     socket.disconnect();
  //     console.log("🔥: A user disconnected");
  //   });
  // });

  server.listen(process.env.PORT || 3000);

  // HTTPS
  const privateKey = fs.readFileSync("sslcert/server.key", "utf8");
  const certificate = fs.readFileSync("sslcert/server.crt", "utf8");
  const httpsOptions = { key: privateKey, cert: certificate };
  https
    .createServer(httpsOptions, expressApp)
    .listen(process.env.HTTPS_PORT || 443);
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
