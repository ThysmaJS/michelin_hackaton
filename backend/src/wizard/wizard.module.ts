import { Module } from '@nestjs/common';
import { WizardController } from './wizard.controller';
import { WizardService } from './wizard.service';
import { TyresModule } from '../tyres/tyres.module';

/** Module wizard : recommandation de pneu à partir du profil d'usage. */
@Module({
  imports: [TyresModule],
  controllers: [WizardController],
  providers: [WizardService],
})
export class WizardModule {}
