import { initAction } from "src/command/init/init.action";
import SERVICE_IDENTIFIER from "src/config/constants/identifiers";
import container from "src/config/ioc_config";
import { clearTestFikaPath } from "test/test-utils";

beforeEach(()=>{
  clearTestFikaPath(process.cwd()+'/test/test-samples/sample_1');
  initAction(process.cwd()+'/test/test-samples/sample_1');
});

test('', 
  ()=>{
    container.unbind(SERVICE_IDENTIFIER.ConnectService);
    let connectionServiceMock = {
      
    }

})