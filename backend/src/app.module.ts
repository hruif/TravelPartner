import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { MapsModule } from './maps/maps.module';
import { DiaryModule } from './diary/diary.module';
import { ItinerariesModule } from './itineraries/itineraries.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    UsersModule,
    MikroOrmModule.forRoot(config),
    MapsModule,
    DiaryModule,
    ItinerariesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
