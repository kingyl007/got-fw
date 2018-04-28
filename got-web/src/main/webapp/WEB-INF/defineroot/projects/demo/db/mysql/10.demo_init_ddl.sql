/*==============================================================*/
/* Table: demo_DEMO                                             */
/*==============================================================*/

create sequence demo_DEMO_SEQ
minvalue 1
increment by 1
nocache;
/

create table demo_DEMO
(
   ID                   int not null,
   NAME                 nvarchar2(100),
   USER_ID              int,
   DEMO_TYPE            nvarchar2(10),
   DEMO_TIME			datetime,
   ISDEL                char(1),
   CREATE_TIME          datetime
);

comment on table demo_DEMO is
'demo开发演示表'
/

comment on column demo_DEMO.ID
  is 'ID';
comment on column demo_DEMO.NAME
  is '名称';
comment on column demo_DEMO.USER_ID
  is '关联用户';
comment on column demo_DEMO.DEMO_TYPE
  is '演示类型';
comment on column demo_DEMO.DEMO_TIME
  is '演示时间';
comment on column demo_DEMO.ISDEL
  is '是否删除';
comment on column demo_DEMO.CREATE_TIME
  is '创建时间';

alter table demo_DEMO
  add constraint PK_demo_DEMO primary key (ID);

CREATE OR REPLACE TRIGGER demo_DEMO_TRG
  BEFORE INSERT ON demo_DEMO
  FOR EACH ROW
DECLARE
  -- LOCAL VARIABLES HERE
BEGIN
  SELECT demo_DEMO_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
END demo_DEMO_TRG;
/  