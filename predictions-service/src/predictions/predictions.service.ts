import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prediction } from '@prisma/client';
import { map } from 'rxjs';
import { PredictionsRepository } from 'src/database/repositories/prediction.repository';
import { FirebaseUser } from 'src/models/user.model';
import { UpdatePredictionDto } from './dto/update-prediction.dto';
import fs from 'fs';
import FormData from 'form-data';

@Injectable()
export class PredictionsService {
  constructor(
    private readonly predictionsRepository: PredictionsRepository,
    private readonly httpService: HttpService,
  ) {}

  async predict(
    payload: Express.Multer.File,
    user: FirebaseUser,
  ): Promise<Prediction> {
    let prediction = {} as Prediction;
    prediction.userId = user.uid;
    prediction.remoteImagePath = payload.path;
    prediction.createdAt = new Date(Date.now());
    prediction.predicted = false;
    try {
      const predictionResponse = await this.callCNNService(payload.path);
      prediction.predicted = true;
      prediction.dx = predictionResponse.dx;
      prediction.diseaseName = predictionResponse.diseaseName;
      prediction.confidence = predictionResponse.confidence;
    } catch (e) {
      console.log(e);
    }
    prediction = await this.predictionsRepository.create({
      data: prediction,
    });
    return prediction;
  }

  async retry(
    payload: Express.Multer.File,
    predictionId: string,
    user: FirebaseUser,
  ): Promise<Prediction> {
    const path: string = payload?.path;

    let prediction =
      predictionId &&
      (await this.predictionsRepository.findOne({
        where: { id: predictionId },
      }));

    if (prediction?.userId && user.id != prediction.userId) {
      throw new UnauthorizedException();
    }

    prediction ??= {
      predicted: false,
      createdAt: new Date(Date.now()),
      validated: false,
      remoteImagePath: path,
      userId: user.uid,
    } as Prediction;

    if (prediction.predicted) {
      return prediction;
    }

    try {
      const predictionResponse = await this.callCNNService(path);
      prediction.predicted = true;
      prediction.dx = predictionResponse.dx;
      prediction.diseaseName = predictionResponse.diseaseName;
      prediction.confidence = predictionResponse.confidence;
    } catch {
      // TODO
    }

    prediction = await this.predictionsRepository.upsert({
      create: prediction,
      update: prediction,
      where: {
        ...(prediction.id && { id: prediction.id }),
        remoteImagePath: prediction.remoteImagePath,
      },
    });

    console.log(prediction);

    return prediction;
  }

  async callCNNService(path: string): Promise<Prediction> {
    const requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const formData = new FormData();
    formData.append('payload', fs.createReadStream(path));
    return await this.httpService
      .post('http://localhost:8080/predict', formData, requestOptions)
      .pipe(map(({ data }) => data))
      .toPromise();
  }

  findAll() {
    console.log('findAll');
    return this.predictionsRepository.findMany({});
  }

  findOne(id: string) {
    return `This action returns a #${id} prediction`;
  }

  update(id: string, updatePredictionDto: UpdatePredictionDto) {
    return `This action updates a #${id} prediction`;
  }

  remove(id: string) {
    return `This action removes a #${id} prediction`;
  }
}
