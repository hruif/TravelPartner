import { Module } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { ItinerariesController } from './itineraries.controller';

@Module({
  providers: [ItinerariesService],
  controllers: [ItinerariesController]
})
export class ItinerariesModule {}
