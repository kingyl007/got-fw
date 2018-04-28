var vue = new Vue({
 el:"#${pageId }",
 data: {
 activeIndex : 0,
 // 表格当前页数据
 tableData: [],
 
 // 多选数组
 multipleSelection: [],
 
 // 请求的URL
 url:'getGridData?fwCoord.function=${view.coord.function}',
 
 // 搜索条件
 criteria: '',
 
 // 下拉菜单选项
 select: '',
 
 // 默认每页数据量
 pagesize: 10,
 
 // 默认高亮行数据id
 highlightId: -1,
 
 // 当前页码
 currentPage: 1,
 
 // 查询的页码
 start: 1,
 
 // 默认数据总数
 totalCount: 1000,
 },

 methods: {
 handleSelect(key, keyPath) {
 console.log(key, keyPath);
 },
 
 // 从服务器读取数据
 loadData: function(criteria, pageNum, pageSize){ 
 this.$http.get(this.url,{parameter:criteria, pageNum:pageNum, pageSize:pageSize}).then(function(res){
 console.info(res);
 this.tableData = res.data.data;
 this.totalCount = res.data.page.totalRow;
 },function(){
 console.log('failed');
 }); 
 },
 
 // 多选响应
 handleSelectionChange: function(val) {
 this.multipleSelection = val;
 },
 
 // 点击行响应
 handleclick: function(row, event, column){
 // this.highlightId = row.id;
 },
 
 // 编辑
 handleEdit: function(index, row) {
 this.$prompt('请输入新名称', '提示', {
 confirmButtonText: '确定',
 cancelButtonText: '取消',
 }).then(({ value }) => {
 if(value==''||value==null)
 return;
 this.$http.post('../update',{"id":row.id,"name":value},{emulateJSON: true}).then(function(res){
 this.loadData(this.criteria, this.currentPage, this.pagesize); 
 },function(){
 console.log('failed');
 });
 }).catch(() => {

 });
 },
 
 
 // 单行删除
 handleDelete: function(index, row) {
 var array = [];
 array.push(row.id);
 this.$http.post('../delete',{"array":array},{emulateJSON: true}).then(function(res){
 this.loadData(this.criteria, this.currentPage, this.pagesize);
 },function(){
 console.log('failed');
 });
 },
 
 // 搜索
 search: function(){
 this.loadData(this.criteria, this.currentPage, this.pagesize);
 },
 
 // 添加
 add: function(){
 this.$prompt('请输入名称', '提示', {
 confirmButtonText: '确定',
 cancelButtonText: '取消',
 }).then(({ value }) => {
 if(value==''||value==null)
 return;
 this.$http.post('../add',{"name":value},{emulateJSON: true}).then(function(res){
 this.loadData(this.criteria, this.currentPage, this.pagesize);
 },function(){
 console.log('failed');
 });
 }).catch(() => {

 });
 
 },
 
 // 多项删除
 deletenames: function(){
 if(this.multipleSelection.length==0)
 return;
 var array = [];
 this.multipleSelection.forEach((item) => {
 array.push(item.id);
 })
 this.$http.post('../delete',{"array":array},{emulateJSON: true}).then(function(res){
 this.loadData(this.criteria, this.currentPage, this.pagesize);
 },function(){
 console.log('failed');
 });
 },
 
 // 改变当前点击的行的class，高亮当前行
 tableRowClassName: function(row, index){
 if(row.id == this.highlightId)
 {
 return 'info-row';
 }
 },
 
 // 每页显示数据量变更
 handleSizeChange: function(val) {
 this.pagesize = val;
 this.loadData(this.criteria, this.currentPage, this.pagesize);
 },
 
 // 页码变更
 handleCurrentChange: function(val) {
 this.currentPage = val;
 this.loadData(this.criteria, this.currentPage, this.pagesize);
 }, 
 
 }, 
 
 
 });
 // 载入数据
 vue.loadData(vue.criteria,vue.currentPage, vue.pagesize);
 // Vue.config.lang = 'en';
 // var vue_${pageId } = vue;
