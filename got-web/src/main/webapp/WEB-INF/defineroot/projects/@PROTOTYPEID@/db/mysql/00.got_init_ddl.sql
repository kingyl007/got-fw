/*!40101 SET NAMES utf8 */;

#
# Structure for table "GOT_CUST"
#
CREATE TABLE GOT_CUST (
  ID int(11) NOT NULL AUTO_INCREMENT,
  LOGINID varchar(255) DEFAULT NULL,
  PARENT_ID int(11) DEFAULT NULL,
  NAME varchar(255) DEFAULT NULL,
  ISDEL char(1) DEFAULT NULL,
  IS_ENABLE char(1) DEFAULT NULL,
  PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "GOT_CUST_RELATION"
#
CREATE TABLE GOT_CUST_RELATION (
  P_ID int(11) NOT NULL DEFAULT '0',
  S_ID int(11) DEFAULT NULL,
  R_LEVEL int(11) DEFAULT NULL,
  PRIMARY KEY (P_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "GOT_USER"
#
CREATE TABLE GOT_USER (
  ID int(11) NOT NULL AUTO_INCREMENT,
  USER_ACCOUNT varchar(255) DEFAULT NULL,
  PASSWORD varchar(255) DEFAULT NULL,
  NAME varchar(255) DEFAULT NULL,
  CUSTOMER_ID int(11) DEFAULT NULL,
  ISDEL char(1) DEFAULT NULL,
  IS_ENABLE char(1) DEFAULT NULL,
  PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE GOT_USER ADD COLUMN DEPT_NAME int(11) DEFAULT NULL;
ALTER TABLE GOT_USER ADD COLUMN VALIDTO DATE DEFAULT NULL;
ALTER TABLE GOT_USER ADD COLUMN ROLE_ID int(11) DEFAULT NULL;

#
# Structure for table "GOT_ROLE"
#
CREATE TABLE GOT_ROLE (
  ROLE_ID int(11) NOT NULL AUTO_INCREMENT,
  ROLE_NAME varchar(50) DEFAULT NULL,
  DIGEST varchar(1000) DEFAULT NULL COMMENT '角色摘要，显示主要的权限内容',
  CUSTOMER_ID int(11) DEFAULT NULL COMMENT '客户ID',
  PRIMARY KEY (ROLE_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "GOT_USERROLE"
#
CREATE TABLE GOT_USERROLE (
  USER_ID int(11) NOT NULL,
  ROLE_ID int(11) NOT NULL,
  PRIMARY KEY (USER_ID,ROLE_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "GOT_RESOURCE"
#
CREATE TABLE GOT_RESOURCE (
  ID int(11) DEFAULT NULL,
  PKEY varchar(200) NOT NULL,
  SID varchar(100) DEFAULT NULL,
  TYPE varchar(100) DEFAULT NULL,
  PARENT_PKEY varchar(200) DEFAULT NULL,
  RES_NAME varchar(200) DEFAULT NULL,
  URL varchar(500) DEFAULT NULL,
  SORT_INDEX decimal(9,2) DEFAULT NULL,
  ENABLED char(1) DEFAULT NULL,
  HAVE_CUST_COL char(1) DEFAULT NULL,
  HAVE_OWNER_COL char(1) DEFAULT NULL,
  HAVE_DEPT_COL char(1) DEFAULT NULL,
  PRIMARY KEY (PKEY)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "GOT_PRIVILEGE"
#
CREATE TABLE GOT_PRIVILEGE (
  ID int(11) NOT NULL AUTO_INCREMENT,
  ROLE_ID int(11) DEFAULT NULL,
  RESOURCE_PKEY varchar(200) DEFAULT NULL,
  HAVE_PRIVILEGE char(1) DEFAULT NULL,
  HAVE_EDIT_PRIVILEGE char(1) DEFAULT NULL,
  DATA_LEVEL varchar(100) DEFAULT NULL COMMENT '数据权限：目前包括所属客户，直接下级客户，所有下级客户，选择的客户，所属部门，直接下级部门，所有下级部门，选择的部门，本人，选择的人员',
  SELECTED_CUST varchar(1000) DEFAULT NULL COMMENT '数据权限包括选择的客户时选中的客户',
  SELECTED_DEPT varchar(1000) DEFAULT NULL COMMENT '数据权限包括选择的部门时选中的部门',
  SELECTED_USER varchar(1000) DEFAULT NULL COMMENT '数据权限包括选择的人员时选中的人员',
  PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Structure for table "GOT_USER_COLUMN"
#
CREATE TABLE GOT_USER_COLUMN (
  PROJECT_ID varchar(100) DEFAULT NULL,
  FUNCTION_ID varchar(100) DEFAULT NULL,
  VIEW_ID varchar(100) DEFAULT NULL,
  USER_ID varchar(50) DEFAULT NULL,
  COLUMN_ID varchar(100) DEFAULT NULL,
  VISIBLE char(1) DEFAULT NULL,
  SORT_INDEX decimal(11,2) DEFAULT NULL,
  WIDTH int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


create table GOT_LOG
(
  ID          INTEGER not null AUTO_INCREMENT,
  LOG_TIME    TIMESTAMP,
  IP          VARCHAR(100),
  USER_ID     VARCHAR(100),
  USER_NAME VARCHAR(100),
  PROJECT_ID  VARCHAR(100),
  FUNCTION_ID VARCHAR(100),
  FUNCTION_NAME VARCHAR(100),
  VIEW_ID     VARCHAR(100),
  VIEW_NAME VARCHAR(100),
  URL         VARCHAR(200),
  LOG_DETAIL  VARCHAR(1000),
  primary key(id)
)ENGINE=MyIsam DEFAULT CHARSET=utf8
;


/*==============================================================*/
/* Table: GOT_WORKFLOW                                          */
/*==============================================================*/
create table GOT_WORKFLOW
(
   ID                   int not null auto_increment,
   PROJECT_ID           varchar(100),
   FUNCTION_ID          varchar(100),
   PK_1                 varchar(100) comment '主键一值',
   PK_2                 varchar(100) comment '主键二值',
   PK_3                 varchar(100) comment '主键三值',
   WORKFLOW_ID          varchar(100) comment '工作流ID',
   STATUS_CODE          varchar(100) comment '状态代码',
   STATUS_NAME          varchar(100) comment '当前状态名称',
   STATUS_INDEX         int comment '当前状态序号（初始为0，推进一步加1，撤回时减1）',
   INIT_USER_ID         varchar(100) comment '发起用户',
   CURRENT_USER_ID      varchar(100) comment '当前处理用户',
   PREVIOUS_USER_ID     varchar(100) comment '上一处理用户',
   NEXT_USER_ID         varchar(100) comment '下一处理用户',
   PARTICIPATE_USER_IDS varchar(1000) comment '所有参与用户，用逗号分隔',
   primary key (ID)
);

/*==============================================================*/
/* Table: GOT_TODO                                              */
/*==============================================================*/
create table GOT_TODO
(
   ID                   int not null auto_increment,
   PROJECT_ID           varchar(100),
   FUNCTION_ID          varchar(100),
   PK_FIELDS 		VARCHAR(100),
   PK_1                 varchar(100) comment '主键一值',
   PK_2                 varchar(100) comment '主键二值',
   PK_3                 varchar(100) comment '主键三值',
   WORKFLOW_ID          varchar(100) comment '工作流ID',
   VIEW_ID              varchar(100),
   USER_ID              varchar(100) comment '任务用户',
   FUNCTION_NAME         varchar(100) comment '功能名',
   TODO_CONTENT         varchar(1000) comment '内容',
   CREATOR_ID 			VARCHAR(100),
   REATOR_NAME VARCHAR(100),
   CREATE_TIME          datetime comment '创建时间',
   ISFINISH             char(1) comment '是否完成',
   FINISH_TIME          datetime comment '完成时间',
   ISDEL                char(1) comment '是否删除',
   primary key (ID)
);
