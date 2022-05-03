import fs from "fs"
import { Config } from "src/domain/entity/config.entity";

export const clearTestFikaPath = (currentPath: string)=>{
  fs.rmdirSync(currentPath + '/test/.fika', {
    recursive: true,
  });
}

export const readTestFikaConfig = (currentPath: string): Config=>{
  const fikaConfigFilePath = currentPath + '/test/.fika/fika.config.json';
  if (fikaConfigFilePath){
    const configString = fs.readFileSync(fikaConfigFilePath, 'utf-8');
    const config = JSON.parse(configString) as Config;
    return config;
  }else{
    throw new Error("Fika config file path is not set");
  }
}