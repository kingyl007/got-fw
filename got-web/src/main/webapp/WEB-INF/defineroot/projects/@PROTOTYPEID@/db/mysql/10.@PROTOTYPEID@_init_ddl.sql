/*==============================================================*/
/* Table: @PROTOTYPEID@_DEMO                                    */
/*==============================================================*/

create sequence @PROTOTYPEID@_DEMO_SEQ
minvalue 1
increment by 1
nocache;
/

create table @PROTOTYPEID@_DEMO
(
   ID                   int not null auto_increment,
   NAME                 varchar(100) comment '名称',
   USER_ID              int comment '关联用户',
   DEMO_TYPE            varchar(10) comment '演示类型',
   DEMO_TIME			datetime comment '演示时间',
   ISDEL                char(1) comment '是否删除',
   CREATE_TIME          datetime comment '创建时间',
   primary key (ID)
);

alter table @PROTOTYPEID@_DEMO comment '@PROTOTYPEID@开发演示表';
