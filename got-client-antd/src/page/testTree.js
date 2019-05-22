import { Tree, Row,Col } from 'antd';
import { Component } from 'react';
const { TreeNode } = Tree;

const treeData = [{
  title: '0-0',
  key: '0-0',
  children: [{
    title: '0-0-0',
    key: '0-0-0',
    children: [
      { title: '0-0-0-0', key: '0-0-0-0' },
      { title: '0-0-0-1', key: '0-0-0-1' },
      { title: '0-0-0-2', key: '0-0-0-2' },
      { title: '0-0-0-2', key: '0-0-0-3' },
      { title: '0-0-0-2', key: '0-0-0-4' },
      { title: '0-0-0-2', key: '0-0-0-5' },
      { title: '0-0-0-2', key: '0-0-0-6' },
      { title: '0-0-0-2', key: '0-0-0-7' },
      { title: '0-0-0-2', key: '0-0-0-8' },
      { title: '0-0-0-2', key: '0-0-0-9' },
      { title: '0-0-0-2', key: '0-0-0-10' },
      { title: '0-0-0-2', key: '0-0-0-11' },
      { title: '0-0-0-2', key: '0-0-0-12' },
      { title: '0-0-0-2', key: '0-0-0-13' },
      { title: '0-0-0-2', key: '0-0-0-14' },
      { title: '0-0-0-2', key: '0-0-0-15' },
      { title: '0-0-0-2', key: '0-0-0-16' },
      { title: '0-0-0-2', key: '0-0-0-17' },
      { title: '0-0-0-2', key: '0-0-0-18' },
      { title: '0-0-0-2', key: '0-0-0-19' },
    ],
  }, {
    title: '0-0-1',
    key: '0-0-1',
    children: [
      { title: '0-0-1-0', key: '0-0-1-0' },
      { title: '0-0-1-1', key: '0-0-1-1' },
      { title: '0-0-1-2', key: '0-0-1-2' },
    ],
  }, {
    title: '0-0-2',
    key: '0-0-2',
  }],
}, {
  title: '0-1',
  key: '0-1',
  children: [
    { title: '0-1-0-0', key: '0-1-0-0' },
    { title: '0-1-0-1', key: '0-1-0-1' },
    { title: '0-1-0-2', key: '0-1-0-2' },
  ],
}, {
  title: '0-2',
  key: '0-2',
}];

export default class Demo extends Component {
  state = {
    expandedKeys: ['0-0-0', '0-0-1'],
    autoExpandParent: true,
    checkedKeys: ['0-0-0'],
    selectedKeys: [],
  }

  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })

  render() {
    return (
      <Row style={{height:'100%'}}>
      <Col span={6} style={{height:'100%', width:300, overflow:'auto'}}>
        <Tree
        style={{height:'100%'}}
        checkable
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
        >
        {this.renderTreeNodes(treeData)}
        </Tree>
      </Col>
      <Col span={18}>
      </Col>
      </Row>
    );
  }
}
