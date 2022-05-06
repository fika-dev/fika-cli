import { Morpher, MorpherConfig } from "src/domain/entity/morpher.entity";
import { ArrowFunction, ClassDeclaration, Node, Project, SyntaxKind, VariableDeclaration, VariableStatement } from 'ts-morph';
import path from 'path';
import fs from 'fs';
import { INode } from "src/domain/entity/i_node";
import { ComponentType } from "src/domain/entity/component.entity";
interface TsMorpherConfig extends MorpherConfig{
  tsConfigFilePath?: string,
}

class TSNode extends INode{
  protected _node: Node;
  private _id: string;

  constructor(node: Node, componentType: ComponentType){
    super();
    this._node=node;
    this._id = this._generateId(node);
    this.componentType = componentType;
  }

  public getId(): string {
    return this._id;
  }

  public setId(id: string){
    this._id = id;
  }

  public getNode() {
    return this._node;
  }

  private _generateId(node: Node):string {
    const fileName: string = node.getSourceFile().getBaseName();
    const position: number = node.getPos();
    return `unconnected:${fileName}:${position}`;
  }
}

const pattern = /["']([A-Z]\w+\.[A-Z]\w+)["']/
export class TypescriptMorpher extends Morpher {
  
  

  private _project: Project;
  private _tsNodes: TSNode[];
  constructor(tsMorpherConfig: TsMorpherConfig){
    super(tsMorpherConfig);
    this.getNodeWithFika = this.getNodeWithFika.bind(this);
    this.addCommentedDecorator = this.addCommentedDecorator.bind(this);
    let absoluteTsConfigPath: string;
    if (tsMorpherConfig.tsConfigFilePath){
      absoluteTsConfigPath = path.join( process.cwd(), tsMorpherConfig.tsConfigFilePath);
      
    }else{
      absoluteTsConfigPath =  path.join(process.cwd(), 'tsconfig.json');
    }
    if (fs.existsSync(absoluteTsConfigPath)){
      this._project = new Project({
        tsConfigFilePath: absoluteTsConfigPath,
      });
      this.findFikaNodes();
    }else{
      throw new Error("typescript config file is needed");
    }
    
  }

  protected findFikaNodes(): void {
    const sourceFiles = this._project.getSourceFiles();
    this._tsNodes = sourceFiles.map(sc=>{
      const statements = sc.getStatementsWithComments();
      const nodes = statements.filter((statement)=>statement.getLeadingCommentRanges().length>0)
        .map((node)=>this._getFikaTSNode(node)) 
        .filter((node)=>node) as TSNode[];
      return nodes;
    }).flat();
  }

  public getFikaNodes(componentType: ComponentType): INode[] {
    return this._tsNodes.filter(node=>node.componentType === componentType);
  }

  public getSymbolText(iNode: INode): string {
    const node = iNode.getNode() as Node;
    const symbol = node.getSymbol();
    if (symbol){
      return symbol.getName();
    }
    else{
      if (isVS(node)){
        const vc = fromVStoVD(node);
        const symbol = vc.getSymbol();
        if (symbol){
          return symbol.getName();
        }else{
          return vc.getInitializer().getSymbol().getName();
        }
      }else{
        return 'NotVS';
      }
    }
  }

  public getTypeText(iNode: INode): string {
    const node = iNode.getNode() as Node;
    const type = node.getType();
    return type.getText();
  }

  public getArguementsFromAF(iNode: INode): string[] {
    const node = iNode.getNode() as Node;
    let vc: VariableDeclaration;
    if (isVS(node)){
      vc = fromVStoVD(node); 
    }
    else if (isVD(node)){
      vc = toVD(node);
    }else if (isCD(node)){
      const cd = toCD(node);
      return cd.getProperties().map((property)=>`${property.getName()}: ${property.getType().getText()}`)
    }else{
      throw Error(`Not VD, VS, CD but ${node.getKindName()}`)
    }
    const initializer = vc.getInitializer();
    if (isAF(initializer)){
      const arrowFunction =  toAF(initializer);
      return arrowFunction.getParameters()
        .map((parameter)=>{
          const type = parameter.getType();
          const typeSymbol = type?.getSymbol();
          if (typeSymbol && (typeSymbol.getMembers().length> 0)){
            const members = typeSymbol.getMembers();
            const membersString = members.map((symbol)=>{
              const vd = symbol.getValueDeclaration();
              return `${symbol.getName()}: ${vd.getType().getText()}`;
            }).join(', ');
            return { name: parameter.getName(), typeName: `{ ${membersString} }`}
          }
          return { name: parameter.getName(), typeName: parameter.getType().getText()}
        })
        .map((parameter)=> `${parameter.name} : ${parameter.typeName}`);
    }
    return [];
  }


  public getFilePath(iNode: INode): string{
    const node = iNode.getNode() as Node;
    const dir = node.getSourceFile().getDirectoryPath();
    const fileName = node.getSourceFile().getBaseName();
    return  (dir +'/' +fileName) as string;
  }

  addCommentedDecorator(){
    const sc = this._project.addSourceFileAtPath('/Users/wonmojung/M1/fika/tool/src/utils/__test__/comment-decorator.test.data.ts')
    const statements = sc.getStatementsWithComments();
    const [fikaNode] = statements.filter((sc)=>sc.getLeadingCommentRanges().length>0)
      .map((node)=>this.getNodeWithFika(node)) 
      .filter((node)=>node) as Node[];
    const beforeText = fikaNode.getText();
    const afterText = "//@FikaUri()\n" + beforeText;
    fikaNode.replaceWithText(afterText);
    this._project.save();
  }
  


  getNodeWithFika(node: Node):Node|false{
    const comments = node.getLeadingCommentRanges();
    const commentsWithFikaDecorator = comments.map((comment)=>comment.getText()).filter((text)=>text.includes('@Fika('))
    if (commentsWithFikaDecorator.length>0){
      return node;
    }
    return false;
  }

  private _getFikaTSNode(node: Node):TSNode|false{
    const comments = node.getLeadingCommentRanges();
    const commentsWithFikaDecorator = comments.map((comment)=>comment.getText()).filter((text)=>text.includes('@Fika('))
    if (commentsWithFikaDecorator.length>0){
      const fikaLine = commentsWithFikaDecorator[0];
      const match = pattern.exec(fikaLine);
      const componentType = ComponentType[match[1].replace('.', '')];
      return new TSNode(node, componentType);
    }
    return false;
  }

  
}




function toVD(node: Node):VariableDeclaration{
  return node.asKind(SyntaxKind.VariableDeclaration);
}

function isVD(node: Node):boolean{
  return node.getKind()===SyntaxKind.VariableDeclaration;
}

function toCD(node: Node):ClassDeclaration{
  return node.asKind(SyntaxKind.ClassDeclaration);
}

function isCD(node: Node):boolean{
  return node.getKind()===SyntaxKind.ClassDeclaration;
}

function toVS(node: Node):VariableStatement{
  return node.asKind(SyntaxKind.VariableStatement);
}

function isVS(node: Node):boolean{
  return node.getKind()===SyntaxKind.VariableStatement;
}

function toAF(node: Node):ArrowFunction{
  return node.asKind(SyntaxKind.ArrowFunction);
}

function isAF(node: Node):boolean{
  return node.getKind()===SyntaxKind.ArrowFunction;
}

function fromVStoVD(node: Node):VariableDeclaration{
  const vs = toVS(node);
  const vcs = vs.getDeclarations();
  return vcs[vcs.length-1];
}

