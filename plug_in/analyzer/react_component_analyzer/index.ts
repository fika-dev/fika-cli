import { AddOnType } from "@/domain/entity/add_on/add_on.entity";
import { Analyzer } from "@/domain/entity/add_on/analyzer.entity";
import { Component, ComponentType } from "src/domain/entity/component.entity";
import { DevObject } from "src/domain/entity/dev_object.entity";
import { INode } from "src/domain/entity/i_node";
import { Morpher } from "@/domain/entity/add_on/morpher.entity";
import { AddOnConfig } from "src/domain/value_object/add_on_config.vo";

export class ReactComponentAnalyzer extends Analyzer {
  private _componentNodes: INode[];
  constructor(config: AddOnConfig) {
    super(config);
    this.addonType = AddOnType.Analyzer;
    this.analyze = this.analyze.bind(this);
  }
  async analyze(morpher: Morpher): Promise<DevObject[]> {
    this._componentNodes = morpher.getFikaNodes(ComponentType.ReactComponent);
    return this._componentNodes.map(node => this._analyzeNode(node, morpher));
  }

  private _analyzeNode(node: INode, morpher: Morpher): Component {
    let component: Component = Component.getEmptyComponent();
    component.id = node.getId();
    component.title = morpher.getSymbolText(node);
    component.filePath = morpher.getFilePath(node);
    component.props = morpher.getArguementsFromAF(node);
    return component;
  }
}
