import fs from "fs"

export const clearTestFikaPath = (currentPath: string)=>{
  fs.rmdirSync(currentPath + '/test/.fika', {
    recursive: true,
  });
}