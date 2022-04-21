import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { Snapshot } from "src/domain/entity/snapshot.entity";
import { IAnalyzeService } from "src/domain/service/i_analyze.service";
import { IConfigService } from "src/domain/service/i_config.service";

export const analyzeAction = () : Snapshot=>{
  const configService = container.get<IConfigService>(SERVICE_IDENTIFIER.ConfigService);
  const analyzeService = container.get<IAnalyzeService>(SERVICE_IDENTIFIER.AnalyzeService);
  const configs = configService.getAnalyzerConfigs();
  analyzeService.registerAnalyzers(configs);
  const analyzedSnapshot = analyzeService.analyze();
  return analyzedSnapshot;
}