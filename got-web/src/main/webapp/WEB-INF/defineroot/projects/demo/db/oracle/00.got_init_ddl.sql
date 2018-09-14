-- prompt PL/SQL Developer import file
-- prompt Created on 2017年7月1日 by wor
-- set feedback off
-- set define off

create sequence GOT_CUST_SEQ
minvalue 1
increment by 1
nocache;
/
-- prompt Creating GOT_CUST...
create table GOT_CUST
(
  ID     INTEGER not null,
  LOGINID   VARCHAR2(255),
  PARENT_ID INTEGER,
  NAME VARCHAR2(255),
  ISDEL CHAR(1),
  IS_ENABLE CHAR(1)
)
;

alter table GOT_CUST
  add constraint PK_GOT_CUST primary key (ID);

CREATE OR REPLACE TRIGGER GOT_CUST_TRG
  BEFORE INSERT ON GOT_CUST
  FOR EACH ROW
DECLARE
  -- LOCAL VARIABLES HERE
BEGIN
  SELECT GOT_CUST_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
END GOT_CUST_TRG;
/  

create table GOT_CUST_RELATION
(
  P_ID     INTEGER not null,
  S_ID    INTEGER not null,
  R_LEVEL INTEGER
);

alter table GOT_CUST_RELATION
  add constraint PK_GOT_CUST_RELATION primary key (P_ID, S_ID);
/  


create sequence GOT_USER_SEQ
minvalue 1
increment by 1
nocache;
/
-- prompt Creating GOT_USER...
create table GOT_USER
(
  ID     INTEGER not null,
  USER_ACCOUNT   VARCHAR2(255),
  PASSWORD   VARCHAR2(255),
  NAME VARCHAR2(255),
  CUSTOMER_ID INTEGER,
  ISDEL CHAR(1),
  IS_ENABLE CHAR(1)
);

  
alter table GOT_USER
  add constraint PK_GOT_USER primary key (ID);

CREATE OR REPLACE TRIGGER GOT_USER_TRG
  BEFORE INSERT ON GOT_USER
  FOR EACH ROW
DECLARE
  -- LOCAL VARIABLES HERE
BEGIN
  SELECT GOT_USER_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
END GOT_USER_TRG;
/  

create sequence GOT_ROLE_SEQ
minvalue 1
increment by 1
nocache;
/

-- prompt Creating GOT_ROLE...
create table GOT_ROLE
(
  ROLE_ID     INTEGER not null,
  ROLE_NAME   VARCHAR2(50),
  DIGEST      VARCHAR2(1000),
  CUSTOMER_ID INTEGER
)
;
comment on column GOT_ROLE.DIGEST
  is '角色摘要，显示主要的权限内容';
comment on column GOT_ROLE.CUSTOMER_ID
  is '客户号';
alter table GOT_ROLE
  add constraint PK_GOT_ROLE primary key (ROLE_ID);

CREATE OR REPLACE TRIGGER GOT_ROLE_TRG
  BEFORE INSERT ON GOT_ROLE
  FOR EACH ROW
DECLARE
  -- LOCAL VARIABLES HERE
BEGIN
  SELECT GOT_ROLE_SEQ.NEXTVAL INTO :NEW.ROLE_ID FROM DUAL;
END GOT_ROLE_TRG;
/  

-- prompt Creating GOT_USERROLE...
create table GOT_USERROLE
(
  USER_ID INTEGER not null,
  ROLE_ID INTEGER not null
)
;
alter table GOT_USERROLE
  add constraint PK_GOT_USERROLE primary key (USER_ID, ROLE_ID);
/

-- prompt Creating GOT_RESOURCE...
create table GOT_RESOURCE
(
  ID             INTEGER,
  PKEY           VARCHAR2(200) not null,
  SID           VARCHAR2(100),
  TYPE           VARCHAR2(100),
  PARENT_PKEY    VARCHAR2(200),
  RES_NAME       VARCHAR2(200),
  RES_ICON       VARCHAR2(200),
  RES_DESC       VARCHAR2(200),
  URL            VARCHAR2(500),
  SORT_INDEX     NUMBER(5,2),
  ENABLED        CHAR(1),
  HAVE_CUST_COL  CHAR(1),
  HAVE_OWNER_COL CHAR(1),
  HAVE_DEPT_COL  CHAR(1)
)
;
alter table GOT_RESOURCE
  add primary key (PKEY);


create sequence GOT_PRIVILEGE_SEQ
minvalue 1
increment by 1
nocache;
/

-- prompt Creating GOT_PRIVILEGE...
create table GOT_PRIVILEGE
(
  ID                  INTEGER not null,
  ROLE_ID             INTEGER,
  RESOURCE_PKEY       VARCHAR2(200),
  HAVE_PRIVILEGE      CHAR(1),
  HAVE_EDIT_PRIVILEGE CHAR(1),
  DATA_LEVEL          VARCHAR2(100),
  SELECTED_CUST       VARCHAR2(1000),
  SELECTED_DEPT       VARCHAR2(1000),
  SELECTED_USER       VARCHAR2(1000)
)
;
comment on column GOT_PRIVILEGE.DATA_LEVEL
  is '数据权限：目前包括所属客户，直接下级客户，所有下级客户，选择的客户，所属部门，直接下级部门，所有下级部门，选择的部门，本人，选择的人员';
comment on column GOT_PRIVILEGE.SELECTED_CUST
  is '数据权限包括选择的客户时选中的客户';
comment on column GOT_PRIVILEGE.SELECTED_DEPT
  is '数据权限包括选择的部门时选中的部门';
comment on column GOT_PRIVILEGE.SELECTED_USER
  is '数据权限包括选择的人员时选中的人员';
alter table GOT_PRIVILEGE
  add constraint PK_GOT_PRIVILEGE primary key (ID);

CREATE OR REPLACE TRIGGER GOT_PRIVILEGE_TRG
  BEFORE INSERT ON GOT_PRIVILEGE
  FOR EACH ROW
DECLARE
  -- LOCAL VARIABLES HERE
BEGIN
  SELECT GOT_PRIVILEGE_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
END GOT_PRIVILEGE_TRG;
/  

create sequence GOT_LOG_SEQ
minvalue 1
increment by 1
nocache;
/


/*==============================================================*/
/* Table: GOT_LOG                                               */
/*==============================================================*/
create table GOT_LOG 
(
   ID                   INTEGER              not null,
   LOG_TIME             DATE,
   IP                   varchar2(100),
   USER_ID              varchar2(100),
   USER_NAME			varchar2(100),
   PROJECT_ID           varchar2(100),
   FUNCTION_ID          varchar2(100),
   FUNCTION_NAME		varchar2(100),
   VIEW_ID              varchar2(100),
   VIEW_NAME			varchar2(100),
   URL                  varchar2(200),
   LOG_DETAIL           varchar2(1000),
   constraint PK_GOT_LOG primary key (ID)
)
/

comment on table GOT_LOG is
'日志表'
/


create or replace trigger GOT_LOG_trg
  before insert on GOT_LOG
  for each row
declare
  -- local variables here
begin
  select GOT_LOG_Seq.nextval into :new.ID from dual;
end GOT_LOG_trg;
/
  
-- prompt Creating GOT_USER_COLUMN...
create table GOT_USER_COLUMN
(
  PROJECT_ID  VARCHAR2(100),
  FUNCTION_ID VARCHAR2(100),
  VIEW_ID     VARCHAR2(100),
  USER_ID     VARCHAR2(50),
  COLUMN_ID   VARCHAR2(100),
  VISIBLE     CHAR(1),
  SORT_INDEX  NUMBER(11,2),
  WIDTH       INTEGER
);
/
  

