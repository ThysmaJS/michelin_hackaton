import { Module } from '@nestjs/common';
import { ReferenceController } from './reference.controller';
import { ReferenceService } from './reference.service';

/** Module référence : contenus statiques de l'UI servis depuis la base. */
@Module({
  controllers: [ReferenceController],
  providers: [ReferenceService],
})
export class ReferenceModule {}
