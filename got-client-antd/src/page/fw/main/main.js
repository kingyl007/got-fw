import { connect} from 'dva';
import {Component } from 'react';
import {LocaleProvider, Layout, Menu, Icon, Tabs, Button, Dropdown, Spin,Avatar,Row, Col,Input,Popover,Skeleton } from 'antd';
import router from 'umi/router';
import MemberSearch from '../../../component/member/memberSearch';

import * as ButtonArea from '../../../component/fw/buttonArea';
import * as got from '../../../logic/got';
import {getSimulateUserId} from '../../../util/request';

// Header, Footer, Sider, Content组件在Layout组件模块下
const { Header, Footer, Sider, Content } = Layout;

const SubMenu = Menu.SubMenu;

const TabPane = Tabs.TabPane;

const Search = Input.Search;
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
    loadLayout: ({fwCoord, fwParam, callback}) => {
      dispatch({
          type: 'fw/loadLayout',
          payload: {fwCoord, fwParam, callback},
      });
    },
    changePassword :({fwCoord, fwParam, otherParams, callback}) => {
      dispatch({
          type: 'fw/changePassword',
          payload: {fwCoord, fwParam, otherParams, callback},
      });
    }
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends Component {
  selectMember = (key, data)=> {
    // alert(key + ':' + JSON.stringify(data));
    console.info('key',key);
    this.openTab('memberDetail','会员资料','projects/zd4s/memberDetail', {memberIdAndCarId:key});
  }

  showMainDataBoard = (e)=> {
    let url = "../../projects/zd4s/biMainBoard.html";
    let simulateUser = getSimulateUserId(location.search);
    if (simulateUser) {
      url = url + '?su=' + simulateUser;
    }
    window.open(url);
    //alert('open main data board');
  }

  getOpenPage = function(key, path, state, action, layout) {
    let Page = null;
    let pagePath = path;
    let functionName = null;
    let view = null;
    let pageStyle = {};
    
    if (action) {
      if (action.argument) {
        functionName = action.argument.function;
        view = action.argument.view;
        if (!view) {
          view = null;
        }
        if (action.argument.antdPath) {
          pagePath = action.argument.antdPath;
        } else if (view) {
          pagePath = 'fw/' + view + '/' + view;
        }
      }
    }
    if (!pagePath) {
      pagePath = 'fw/grid/grid';
    }
    Page = require(`../../${pagePath}`).default;
    return (
    <div style={{height:'100%'}}>
    <Page 
      innerLayout={layout} 
      innerFwCoord={{...this.state.fwCoord, 'function':functionName, view}} 
      state={state}
      mainPagePath={pagePath}
      refreshMemberList={()=>{if (this.memberSearchIns) this.memberSearchIns.refresh()}}
      jumpTo={(path, state, otherParams)=>this.switchTabPage(key, path, state, otherParams)}
      openMainTab={(key, path, state, options, action)=>this.openTab(key, path, state, options, action)}
      closeMainTab={()=>this.onEditTab(key, 'remove')}
    />
    </div>
    )
  }

  onEditTab = (targetKey, action) => {
    const {tabs} = this.state;
    if (action == 'remove') {
      let currentIndex = 0;
      Object.keys(tabs).map((key,index)=>key == targetKey?currentIndex=index:null);
      delete tabs[targetKey];
      --currentIndex;
      if (currentIndex < 0) {
        currentIndex = 0;
      }
      this.setState({tabs, activeTab:Object.keys(tabs)[currentIndex]});
    }
  }

  openTab = (key, label, path, state, action) => {
    // 判断是否已经打开，已经打开，则设置参数
    // 未打开则打开
    // 如果指定了Path，则直接使用Path,如果未指定Path，则从options中取得action
    const newTabs = this.state.tabs;
    let functionName = null;
    let view = null;
    let icon = null;
    let localLabel = label;
    if (action) {
      if (action.argument) {
        functionName = action.argument.function;
        view = action.argument.view;
      }
      icon = action.icon;
      if (!localLabel) {
        localLabel = action.label;
      }
    }
    if (!view) {
      view = null;
    }
    if (!icon) {
      icon = 'pie-chart';
    }
    const style = {style:{...got.getFillHeight(60)}};
    if (!newTabs[key]) {
      newTabs[key] = 
      <TabPane key={key} {...style} tab={<span><Icon type={icon} />{localLabel}</span>} closable={key != this.state.firstTab} style={{margin:'10px'}}>
        <Spin size="large" style={{width:'100%'}} >加载中...</Spin>
      </TabPane>
      this.setState({tabs:newTabs, activeTab:key});
      if (functionName) {
        this.props.loadLayout({fwCoord:{...this.getFwCoord(), 'function':functionName, view}, callback:(layout)=> {
          const newTabs = {...this.state.tabs};
          newTabs[key] = 
          <TabPane key={key} {...style} action={action} tab={<span><Icon type={icon} />{localLabel}</span>} closable={key != this.state.firstTab}>
          {this.getOpenPage(key, path, state, action, layout)}
          </TabPane>
          this.setState({tabs:newTabs, activeTab:key});
        }});
      } else {
        newTabs[key] = 
        <TabPane key={key} {...style} action={action} tab={<span><Icon type={icon} />{localLabel}</span>} closable={key != this.state.firstTab}>
        {this.getOpenPage(key, path, state, action, null)}
        </TabPane>
        this.setState({tabs:newTabs, activeTab:key});
      }
    } else {
      newTabs[key] = 
      <TabPane key={key} {...style} action={action} tab={<span><Icon type={icon} />{localLabel}</span>} closable={key != this.state.firstTab}>
        {this.getOpenPage(key, path, state, action, null)}
      </TabPane>
      this.setState({newTabs,activeTab:key});
    }
  }

  switchTabPage = (key, path, state, otherParams)=> {
    // const {layout} = otherParams;
    console.info('otherParams', otherParams);
    const Page = require(`../../${path}`).default;
    const newTabs = this.state.tabs;
    const action = newTabs[key].props.action;
    const PageIns = <Page 
      {...otherParams}
      backParams={otherParams}
      state={state}
      mainPagePath={path}
      jumpTo={(path, state, otherParams={})=>this.switchTabPage(key, path, state, otherParams)}  
    />;
    newTabs[key] = <TabPane key={key} action={action} tab={<span><Icon type={action.icon} />{action.label}</span>} closable={key != this.state.firstTab}>
      {PageIns}
    </TabPane>
    this.setState({tabs:newTabs});
  }

  onMenuClick = function({ item, key, keyPath }) {
    if (!this.state.tabs[key]) {
      const action = this.getLayout().actionArgs[key];
      this.openTab(key,null,null,null,action);
    } else {
      this.setState({activeTab:key});
    }
  }

  onSystemMenuClick = function(e) {
    if (e.key == 'changePassword') {
      ButtonArea.getActionEntry(this, 'showChangePassword').logic(this, 'showChangePassword',null,-1,e);
    } else if (e.key == 'exit') {
      // alert('exit');
    }
  }

  onTabExtendMenuClick = function(e) {
    let currentTab = this.state.activeTab;
    if (e.key === 'closeAll') {
      currentTab = this.state.firstTab;
    }
    const newTabs = this.state.tabs;
    let firstTab = Object.keys(newTabs)[0];
    console.info(firstTab);
    Object.keys(this.state.tabs).map((key, index)=>(index > 0&&(currentTab == null || key !== currentTab)?delete newTabs[key]:null));
    this.setState({tabs:newTabs, activeTab:currentTab==null?firstTab:currentTab});
  }
  
  rootSubmenuKeys = [];

  onOpenChange = (openKeys, collapsed) => {

    console.info('openchange', openKeys, collapsed);
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      if (collapsed) {
        this.setState({ openKeys:[] });
      } else {
        this.setState({ openKeys });
      }
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      ...props,
      openKeys: [],
      collapsed:false,
      activeTab: null,
      dialogs:{},
      tabs:{},
      firstTab:null,
    }
  }
  
  componentDidMount() {
    if (!this.props.innerLayout) {
      this.setTitle()
    }
    if (this.props.onRef) {
        this.props.onRef(this);
    }
  }
  
  setTitle(newTitle) {
    const { title,project } = this.getLayout();
    let finalTitle = '';
    if (project) {
      if (project['main.title']) {
        finalTitle = project['main.title'];
      } else if (project['project.title']) {
        finalTitle = project['project.title'];
      }
    }
    if (!finalTitle && title) {
      finalTitle = title;
    }
    if (newTitle) {
      finalTitle = newTitle;
    }
    
    document.title = finalTitle;
  }

  getLayout = () => {
    if (this.props.innerLayout) {
      return this.props.innerLayout;
    }
    return this.props.layout;
  }

  getFwCoord = () => {
    return {...this.props.fwCoord, ...this.props.innerFwCoord};
  }
  
  render() {
    this.rootSubmenuKeys = [];
    const menus = this.getLayout().displayActions.filter(act=>act.id.indexOf('_') != 0).map(act=>{
      if (act.tag === 'group') {
        if (act.children && act.children.filter(ac=>ac.visible).length > 0) {
          let firstLabel = null;
          const subMenus = act.children.filter(sa=>sa.visible).map(sa=>{
            firstLabel=sa.label; 
            if (this.state.firstTab == null) {
              this.state.firstTab = sa.id;
              this.setState({firstTab:sa.id}, () => this.onMenuClick({item:null, key:this.state.firstTab, keyPath:null}));
            }
            return <Menu.Item key={sa.id}><Icon type={sa.icon?sa.icon:''}/><span>{sa.label}</span></Menu.Item>
          });
          if (subMenus.length == 1 && firstLabel == act.label) {
            return subMenus[0];
          } else {
            this.rootSubmenuKeys.push('group_' + act.id);
            return  (<SubMenu
            key={'group_' + act.id}
            title={<span><Icon type={act.icon?act.icon:'setting'} /><span>{act.label}</span></span>}
            >
            {subMenus}
            </SubMenu>)
          }
        }
      }
    });
    const userMenus = (
      <Menu onClick={(e) => this.onSystemMenuClick(e)} >
        <Menu.Item key="changePassword">修改密码</Menu.Item>
        <Menu.Item key="exit">
          <a href="/fw/logout">退出系统</a>
        </Menu.Item>
      </Menu>
    );

    const tabExtendMenus = (
      <Menu onClick={(e) => this.onTabExtendMenuClick(e)}>
        <Menu.Item key="closeAll">全部关闭</Menu.Item>
        <Menu.Item key="closeOthers">关闭其它</Menu.Item>
      </Menu>
    );
    const tabExtend = 
    <Dropdown overlay={tabExtendMenus}>
      <a className="ant-dropdown-link" href="javascript:;">
        <Icon type="down" />
      </a>
    </Dropdown>;
    const lang = 'zh_CN';
    const locale = require(`antd/lib/locale-provider/zh_CN`);
    //const logoPath = this.getLayout().project?this.getLayout().project['project.logo']:null;
    //const logo = logoPath?require(`../../../../${logoPath}`):null;
    let logo = null;
    let logoWidth = 150;
    let logoMargin = 20;
    if (this.getLayout() && this.getLayout().project && this.getLayout().project['project.logo']) {
      logo = `../../../../${this.getLayout().project['project.logo']}`;
    }
      
    if (this.getLayout().loading) {
      return <Spin size="large" >加载中...</Spin>
    }
    return (
      <LocaleProvider locale={locale}>
            <Layout style={{height:'100%'}}>
              <Sider width={220} style={{ overflow: 'auto', height:'100%', left: 0 }}
                collapsed={this.state.collapsed}
              >
                <div style={{ textAlign:'center'}}>
                  <img src={logo} style={{width:logoWidth, margin:logoMargin}}/>
                  <Button onClick={()=>this.setState({collapsed:!this.state.collapsed})} style={{ width:'90%', margin: 10, backgroundColor:'#192C3E', border:'none', color:'#7F7F7F'}}>
                    <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                  </Button>
                </div>
                <Menu theme="dark" 
                  mode="inline" 
                  inlineCollapsed={this.state.collapsed}
                  defaultSelectedKeys={['1']} 
                  selectedKeys={[this.state.activeTab]} 
                  onClick={({ item, key, keyPath })=>this.onMenuClick({ item, key, keyPath })}
                  openKeys={this.state.openKeys}
                  onOpenChange={(openKeys)=>this.onOpenChange(openKeys)}
                >
                  {menus}
                </Menu>
              </Sider>
              <Content style={{height:'100%'}}>
              <Layout style={{height:'100%'}}>
                <Header style={{textAlign: 'center', paddingLeft: 10, paddingRight:10, height:60, backgroundColor:'#ffffff' }}>
                  <Row>
                    <Col span={3} style={{textAlign:'left', color:'#0', fontSize:24, minWidth:location.hostname == 'ddb.gpswv.com'?100:230, maxWidth:location.hostname == 'ddb.gpswv.com'?100:230}}>
                      {(this.getLayout().project?(this.getLayout().project['main.title']?this.getLayout().project['main.title']:this.getLayout().project['project.name']):(null))}
                    </Col>
                    <Col span={1} style={{textAlign:'left'}}>
                      {this.getLayout().actionArgs['bi_mainboard'] && this.getLayout().actionArgs['bi_mainboard'].visible?<Button type="primary" shape="circle" icon="fund" size="large" onClick={(e)=>this.showMainDataBoard(e)}/>:null}
                    </Col>
                    <Col style={{textAlign:'right'}}>
                      {this.getLayout().actionArgs['search_member'] && this.getLayout().actionArgs['search_member'].visible?<MemberSearch selectedMember={this.selectMember} onRef={(ins)=>this.memberSearchIns=ins} />:null}
                      <Popover content="客服电话 XXXX-XXXXXXXX">
                      <Icon type="customer-service" size="large" style={{fontSize:20, color:'#0', margin:'0 20px 0 10px' }}/>
                      </Popover>
                      <Avatar icon="user" style={{ marginRight:'10px' }}/>
                      <Dropdown overlay={userMenus}>
                        <a className="ant-dropdown-link" href="javascript:;" style={{color:'#0'}}>
                          {this.getLayout().user?this.getLayout().user.name:'未知'} <Icon type="down" />
                        </a>
                      </Dropdown>
                      </Col>
                  </Row>
                  {Object.values(this.state.dialogs)}
                </Header>
                <Content style={{ height:'100%', left: 0, marginLeft:10, marginRight:10, marginTop:12}}>
                <Tabs defaultActiveKey="1" 
                  type="editable-card"
                  style={{height:'100%'}}
                  hideAdd 
                  activeKey={this.state.activeTab} 
                  tabBarExtraContent={tabExtend}
                  onChange={(activeKey)=>this.setState({activeTab:activeKey})} 
                  onEdit={(targetKey, action)=>this.onEditTab(targetKey, action)}>
                    { Object.values(this.state.tabs) }
                </Tabs>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </LocaleProvider>
    )
  }
}
