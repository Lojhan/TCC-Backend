import { Injectable } from '@nestjs/common';
import { Prisma, Prediction } from '@prisma/client';
import { PrismaService } from '../config/prisma-client.service';
import { Repository } from './abstract/repository.interface';
@Injectable()
export class PredictionsRepository implements Repository<Prediction> {
  constructor(public $client: PrismaService) {}

  findOne(options: Prisma.PredictionFindUniqueArgs): Promise<Prediction> {
    return this.$client.prediction.findUnique(options);
  }
  findMany(options: Prisma.PredictionFindManyArgs): Promise<Prediction[]> {
    return this.$client.prediction.findMany(options);
  }
  count(options: unknown): Promise<number> {
    return this.$client.prediction.count(options);
  }
  create(entity: Prisma.PredictionCreateArgs): Promise<Prediction> {
    return this.$client.prediction.create(entity);
  }
  update(entity: Prisma.PredictionUpdateArgs): Promise<Prediction> {
    return this.$client.prediction.update(entity);
  }
  delete(entity: Prisma.PredictionDeleteArgs): Promise<Prediction> {
    return this.$client.prediction.delete(entity);
  }
}
