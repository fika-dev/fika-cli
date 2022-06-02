import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { Snapshot } from "src/domain/entity/snapshot.entity";
import { IAnalyzeService } from "src/domain/service/i_analyze.service";
import { IConfigService } from "src/domain/service/i_config.service";
import { IMorphService } from "src/domain/service/i_morph.service";

export const  analyzeAction = async () : Promise<Snapshot> => {
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const analyzeService = container.get<IAnalyzeService>(SERVICE_IDENTIFIER.AnalyzeService);
  const morphService = container.get<IMorphService>(SERVICE_IDENTIFIER.MorphService);

  configService.readConfig();
  const analyzerConfigs = configService.getAnalyzerConfigs();
  analyzeService.registerAnalyzers(analyzerConfigs);

  const morpherConfig = configService.getMorpherConfig();
  morphService.configMorpher(morpherConfig);
  const morpher = morphService.getMorpher();

  const analyzedSnapshot = await analyzeService.analyze(morpher);
  return analyzedSnapshot;
}