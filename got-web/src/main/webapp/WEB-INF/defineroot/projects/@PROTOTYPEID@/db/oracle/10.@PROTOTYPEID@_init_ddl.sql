/*==============================================================*/
/* Table: @PROTOTYPEID@_DEMO                                             */
/*==============================================================*/

create sequence @PROTOTYPEID@_DEMO_SEQ
minvalue 1
increment by 1
nocache;
/

create table @PROTOTYPEID@_DEMO
(
   ID                   int not null,
   NAME                 nvarchar2(100),
   USER_ID              int,
   DEMO_TYPE            nvarchar2(10),
   DEMO_TIME			datetime,
   ISDEL                char(1),
   CREATE_TIME          datetime
);

comment on table @PROTOTYPEID@_DEMO is
'@PROTOTYPEID@开发演示表'
/

comment on column @PROTOTYPEID@_DEMO.ID
  is 'ID';
comment on column @PROTOTYPEID@_DEMO.NAME
  is '名称';
comment on column @PROTOTYPEID@_DEMO.USER_ID
  is '关联用户';
comment on column @PROTOTYPEID@_DEMO.DEMO_TYPE
  is '演示类型';
comment on column @PROTOTYPEID@_DEMO.DEMO_TIME
  is '演示时间';
comment on column @PROTOTYPEID@_DEMO.ISDEL
  is '是否删除';
comment on column @PROTOTYPEID@_DEMO.CREATE_TIME
  is '创建时间';

alter table @PROTOTYPEID@_DEMO
  add constraint PK_@PROTOTYPEID@_DEMO primary key (ID);

CREATE OR REPLACE TRIGGER @PROTOTYPEID@_DEMO_TRG
  BEFORE INSERT ON @PROTOTYPEID@_DEMO
  FOR EACH ROW
DECLARE
  -- LOCAL VARIABLES HERE
BEGIN
  SELECT @PROTOTYPEID@_DEMO_SEQ.NEXTVAL INTO :NEW.ID FROM DUAL;
END @PROTOTYPEID@_DEMO_TRG;
/  