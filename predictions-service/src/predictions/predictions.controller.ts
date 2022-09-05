import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { UpdatePredictionDto } from './dto/update-prediction.dto';
import { FirebaseTokenGuard } from 'src/guards/firebase-token.guard';
import { User } from 'src/decorators/user-decorator';
import { FirebaseUser } from 'src/models/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  static diskStorage() {
    return multer.diskStorage({
      destination: (_, __, cb) => cb(null, './uploads'),
      filename: (_, file, cb) => cb(null, file.originalname),
    });
  }

  @Post('/predict')
  @UseGuards(FirebaseTokenGuard)
  @UseInterceptors(
    FileInterceptor('payload', {
      dest: 'uploads/',
      preservePath: true,
      storage: PredictionsController.diskStorage(),
    }),
  )
  predict(
    @UploadedFile() file: Express.Multer.File,
    @User() user: FirebaseUser,
  ) {
    return this.predictionsService.predict(file, user);
  }

  @Post('/retry')
  @UseGuards(FirebaseTokenGuard)
  @UseInterceptors(
    FileInterceptor('payload', {
      dest: 'uploads/',
      preservePath: true,
      storage: PredictionsController.diskStorage(),
    }),
  )
  retry(
    @UploadedFile() file: Express.Multer.File,
    @User() user: FirebaseUser,
    @Body('id') predictionId: string,
  ) {
    return this.predictionsService.retry(file, predictionId, user);
  }

  @Get()
  findAll() {
    return this.predictionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.predictionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePredictionDto: UpdatePredictionDto,
  ) {
    return this.predictionsService.update(id, updatePredictionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.predictionsService.remove(id);
  }
}
