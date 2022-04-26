import { Morpher, MorpherConfig } from "src/domain/entity/morpher.entity";
import { Node, Project } from 'ts-morph';

interface TsMorpherConfig extends MorpherConfig{
  tsConfigFilePath?: string,
}

export class TypescriptMorpher extends Morpher {
  private project: Project;
  constructor(tsMorpherConfig: TsMorpherConfig){
    super(tsMorpherConfig);
    this.getNodeWithFika = this.getNodeWithFika.bind(this);
    this.addCommentedDecorator = this.addCommentedDecorator.bind(this);
    if (tsMorpherConfig.tsConfigFilePath){
      this.project = new Project({
        tsConfigFilePath: tsMorpherConfig.tsConfigFilePath,
      });
    } 
  }

  


  addCommentedDecorator(){
    const sc = this.project.addSourceFileAtPath('/Users/wonmojung/M1/fika/tool/src/utils/__test__/comment-decorator.test.data.ts')
    const statements = sc.getStatementsWithComments();
    const [fikaNode] = statements.filter((sc)=>sc.getLeadingCommentRanges().length>0)
      .map((node)=>this.getNodeWithFika(node)) 
      .filter((node)=>node) as Node[];
    const beforeText = fikaNode.getText();
    const afterText = "//@FikaUri()\n" + beforeText;
    fikaNode.replaceWithText(afterText);
    this.project.save();
  }
  


  getNodeWithFika(node: Node):Node|false{
    const comments = node.getLeadingCommentRanges();
    const commentsWithFikaDecorator = comments.map((comment)=>comment.getText()).filter((text)=>text.includes('@Fika('))
    if (commentsWithFikaDecorator.length>0){
      return node;
    }
    return false;
  }
}