import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { checkImage } from './shared/Utils';

@Injectable()
export class AppService {
  getHello(): string {
    return 'English Exam API';
  }

  async uploadFile(file: Express.Multer.File) {
    if (!checkImage(file)) {
      throw new HttpException('Invalid image', HttpStatus.BAD_REQUEST);
    }

    const { originalname, buffer } = file;
    const fileName = originalname.replace(/\s/g, '-');

    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: process.env.AWS_BUCKET,
      Key: `${uuid()}-${fileName}`,
      Body: buffer,
    }).promise();

    return uploadResult.Location;
  }
}
