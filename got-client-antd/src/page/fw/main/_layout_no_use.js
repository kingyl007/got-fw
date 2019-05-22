import { connect} from 'dva';
import {Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import Link from 'umi/link';

// Header, Footer, Sider, Content组件在Layout组件模块下
const { Header, Footer, Sider, Content } = Layout;

const SubMenu = Menu.SubMenu;

function mapStateToProps(state) {
  const {dispatch, fwCoord, layout} = state.fw;
  return {
      loading: state.loading.models.fw,
      dispatch,
      fwCoord,
      layout,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      tabs:{},
    }
  }
  render() {
    return (
      <Layout>
        <Sider width={256} style={{ minHeight: '100vh'}}>
            <div style={{ height: '32px', background: 'rgba(255,255,255,.2)', margin: '16px'}}/>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
                <Link to="grid?fwCoord.function=users">
                    <Icon type="pie-chart" />
                    <span>Helloworld</span>
                </Link>
            </Menu.Item> 
            <Menu.Item key="20">
            <Link to="grid?fwCoord.function=plc">
                <Icon type="pie-chart" />
                <span>Member</span>
            </Link>
        </Menu.Item>
            <SubMenu
              key="sub1"
              title={<span><Icon type="dashboard" /><span>Dashboard</span></span>}
            >
               <Menu.Item key="2"><Link to="/dashboard/analysis">分析页</Link></Menu.Item>
               <Menu.Item key="3"><Link to="/dashboard/monitor">监控页</Link></Menu.Item>
               <Menu.Item key="4"><Link to="/dashboard/workplace">工作台</Link></Menu.Item>
            </SubMenu>
          </Menu>
          </Sider>
        <Layout>
          <Header style={{ background: '#fff', textAlign: 'center', padding: 0 }}>Header</Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                { this.props.children }
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    )
  }
}
