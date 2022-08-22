import { HttpService } from '@nestjs/axios';
import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { Prediction } from '@prisma/client';
import multer from 'multer';
import { buffer, map } from 'rxjs';
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
    const requestOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const formData = new FormData();
    formData.append('payload', fs.createReadStream(payload.path));
    console.log(payload);
    const predictionResult = this.httpService
      .post('http://localhost:8080/predict', formData, requestOptions)
      .pipe(map(({ data }) => data))
      .toPromise();

    const prediction = {} as Prediction;
    prediction.userId = user.uid;
    prediction.remoteImagePath = payload.path;
    prediction.createdAt = new Date(Date.now());
    prediction.predicted = false;
    try {
      const predictionResponse: Prediction = await predictionResult;
      prediction.predicted = true;
      prediction.dx = predictionResponse.dx;
      prediction.diseaseName = predictionResponse.diseaseName;
      prediction.confidence = predictionResponse.confidence;
    } finally {
      await this.predictionsRepository.create({ data: prediction });
    }
    return prediction;
  }

  findAll() {
    return `This action returns all predictions`;
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
