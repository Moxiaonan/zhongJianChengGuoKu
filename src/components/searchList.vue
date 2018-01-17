<template>
	<div>
		<div class="search-list-header">
			<el-button type="primary" plain class="header-btn" @click="createNewTab"> + 创建会议</el-button>
			<el-input placeholder="请输入内容" v-model="keywordInput" class="input-keyword" prefix-icon="el-icon-search" @keydown.enter.native="getTableData(1)">
			    <el-button slot="append" @click="getTableData(1)">查询</el-button>
			</el-input>
			<el-button type="primary" plain class="header-btn" icon="el-icon-refresh" @click="refreshData"></el-button>
			<div class="orderCondition">
				<el-dropdown :show-timeout="0" @command="chooseOrder">
			      <div class="popover-entry">
				    <span style="margin-left:8px;color:#0096eb;">{{currOrderInfo.label}}</span>
				    <div style="display:inline-flex;flex-direction:column;align-items: center;position: relative;width:20px;height: 24px;">
					    <i class="el-icon-caret-top" :class="(currOrderInfo.order == 'asc')?'iconActive':'iconNotActive'" style="position:absolute;top:0px;"></i>
					    <i class="el-icon-caret-bottom" :class="(currOrderInfo.order == 'desc')?'iconActive':'iconNotActive'" style="position:absolute;bottom:0px;"></i>
				    </div>
				  </div>
			      <el-dropdown-menu slot="dropdown">
			        <el-dropdown-item v-for="(item,index) in orderInfos" :key="index" :command="item">
			        	<div>
				  			<i class="el-icon-check" :style="{'opacity':(currOrderInfo.field == item.field && currOrderInfo.order == item.order)?1:0,'color':'#0096eb','font-weight':'600'}"></i>
				  			<span>{{item.label + item.orderLabel}}</span>
				  		</div>
			        </el-dropdown-item>
			      </el-dropdown-menu>
			    </el-dropdown>
			</div>
		</div>
		<div class="search-list-body">
			<el-table :data="tableData" stripe style="width: 100%" class="search-list-table" @row-click="rowClickHandle":row-style="rowStyle" ref="meetingTable" @sort-change="handleSortChange">
			    <el-table-column prop="meetingName" label="会议名称" min-width="50"></el-table-column>
			    <el-table-column prop="meetingCompere" label="主持人" min-width="25"></el-table-column>
			    <el-table-column prop="meetingTime" label="会议时间" min-width="25" :sortable="true" sort-by="meetingTime"></el-table-column>
			    <el-table-column prop="themeListLength" label="主题个数" min-width="10"></el-table-column>
			    <el-table-column prop="meetingCreateTime" label="创建时间" min-width="25" :sortable="true" sort-by="meetingCreateTime"></el-table-column>
			    <el-table-column  label="修改" min-width="10">
			    	<template slot-scope="scope">
				        <span type="text" class="row-operate-btn" @click.stop="editMeeting(scope.row)">编辑</span>
				        <el-popover
						  placement="left"
						  width="160"
						 trigger="click"
						 v-model="scope.row.delPopShow">
						  <p>删除会议：{{scope.row.meetingName}} ?</p>
						  <div style="text-align: right; margin: 0">
						    <el-button size="mini" type="text" @click="scope.row.delPopShow = false">取消</el-button>
						    <el-button type="primary" size="mini" @click="confirmDel(scope.row)">确定</el-button>
						  </div>
				          <span type="text" class="row-operate-btn" slot="reference" @click="preDelete(scope.row,tableData)">删除</span>
						</el-popover>
						<!-- <el-button type="text" size="small" @click.stop="deleteMeeting(scope.row)">删除</el-button> -->
				    </template>
			    </el-table-column>
			</el-table>
		</div>
		<div class="search-list-footer">
			<el-pagination
		      @current-change="handleCurrentChange"
		      :current-page="pageParam.currentPage"
		      :page-size="pageParam.pageSize"
		      layout="total, prev, pager, next, jumper"
		      :total="pageParam.totalRow"
		      :page-count="pageParam.pageCount">
		    </el-pagination>
		</div>
	</div>
</template>
<script>
	// import UrlConfig from '../urlConfig.js';
	// var UrlConfig = this.urlConfig;
	import GetFtoken from '../getFtoken.js';
	export default{
		data(){
			return {
				visible2:false,
				keywordInput:'',
				keywordReal:'',
				tableData:[],
				pageParam:{
					pageSize:0,
					totalRow:0,
					currentPage:1,
					pageCount:0,
				},
				rowStyle:{
					cursor:'pointer'
				},
				orderInfos:[
					{label:'会议时间',orderLabel:' 由近到远',order:'desc',field:'meeting_time'},
					{label:'会议时间',orderLabel:' 由远到近',order:'asc',field:'meeting_time'},
					{label:'创建时间',orderLabel:' 由近到远',order:'desc',field:'meeting_create_time'},
					{label:'创建时间',orderLabel:' 由远到近',order:'asc',field:'meeting_create_time'},
				],
				currOrderInfo:{
					label:'会议时间',
					order:'desc',
					field:'meeting_time'
				}
			}
		},
		methods:{
			getTableData(currPage){
				this.keywordReal = this.keywordInput;
				var param = {}
				if(this.keywordReal === undefined || this.keywordReal === null){
					param.keyword = '';
				}else{
					param.keyword = this.keywordReal;
				}
				if(currPage === '' || currPage === undefined || currPage === null){
					param.currPage = 1;
				}else{
					param.currPage = currPage;
				}
				param.orderField = this.currOrderInfo.field;
				param.order = this.currOrderInfo.order;
				this.sendTableDataXhr(param);
			},
			handleCurrentChange(curr){
				this.getTableData(curr);
			},
			rowClickHandle(row, event, column){
				// console.log(event);
				if (event.srcElement.className.indexOf('row-operate-btn') == -1) {
					var meetingDetailObj = {action:'watchMeetingDetail',meeting:row};
					this.$emit('createNewTab',meetingDetailObj);
				}
			},
			createNewTab(){
				this.$emit('createNewTab','new');
			},
			editMeeting(row){
				var meetingDetailObj = {action:'editMeeting',meeting:row};
				this.$emit('createNewTab',meetingDetailObj);
			},
			confirmDel(row){
				this.deleteMeeting(row);
				row.delPopShow = false;
			},
			preDelete(row,tableData){
				tableData.forEach(function(item,index){
					item.delPopShow = false;
				});
				row.delPopShow = true;
			},
			deleteMeeting(row){
				var deleteMeetingXhr = new XMLHttpRequest();
				deleteMeetingXhr.responseType = 'text';
				deleteMeetingXhr.onreadystatechange = ()=>{
					if (deleteMeetingXhr.readyState == 4) {
						if (deleteMeetingXhr.status == 200) {
							this.$message({
								message: '删除成功',
						        type: 'success'
							});
							var param = {action:'refreshSearchList'}
							this.$emit('dynamicEvent',param);
						} else {}
					} else {}
				}
				deleteMeetingXhr.open('POST',this.urlConfig.deleteMeetingUrl);
				deleteMeetingXhr.setRequestHeader('Content-Type','application/json');
				deleteMeetingXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
				row.projectType = this.prjType;
				deleteMeetingXhr.send(JSON.stringify(row));
			},
			sendTableDataXhr(param){
				var getTableDataXhr = new XMLHttpRequest();
				getTableDataXhr.responseType = 'json';
				getTableDataXhr.onreadystatechange = ()=>{
					if (getTableDataXhr.readyState == 4) {
						if (getTableDataXhr.status == 200) {
							var pageInfo = getTableDataXhr.response;
							this.tableData = pageInfo.list;
							this.pageParam.totalRow = pageInfo.total;
							this.pageParam.currentPage = pageInfo.pageNum;
							this.pageParam.pageCount = pageInfo.pages;
							this.pageParam.pageSize = pageInfo.pageSize;
						}
					}
				}
				getTableDataXhr.open('POST',this.urlConfig.getTableDataUrl);
				getTableDataXhr.setRequestHeader('Content-Type','application/json');
				param.projectType = this.prjType;
				getTableDataXhr.send(JSON.stringify(param));
			},
			refreshData(){
				var param = {
					keyword:'',
					currPage:1,
					orderField:this.currOrderInfo.field,
					order:this.currOrderInfo.order
				}
				this.sendTableDataXhr(param);
			},
			chooseOrder(command){
				
				this.currOrderInfo = command;
				console.log(this.$refs['meetingTable']);
				this.$refs['meetingTable'].clearSort();
				this.getTableData(1);
			},
			handleSortChange(sortInfo){
				console.log('-----------sortInfo-------------');
				console.log(sortInfo);
				console.log(this.$refs['meetingTable']);
			}
		},
		created(){
			this.getTableData(1);
		}
	}
</script>
<style scoped>
.search-list-header{
	display: flex;
}
.search-list-header .header-btn{
	margin: 0 20px;
	background-color: transparent;
	color: #0096eb;
	border-color: #0096eb;
	padding: 0 20px;
	height: 35px;
}	
.search-list-header .input-keyword{
	width: 400px;
}
.search-list-header .input-keyword >>> .el-input__inner{
	border: 1px #0096eb solid;
	height: 35px;
}
.search-list-header .input-keyword >>> .el-input-group__append{
	background-color: transparent;
	border-color: #0096eb;
	color: #0096eb;
	height: 33px;
	padding: 0px 20px;
}
.search-list-header .input-keyword >>> .el-input__prefix{
	color: #0096eb;
	height: 35px;
}
.search-list-header .input-keyword >>> .el-input__icon{
	line-height: 35px;
}
.search-list-body{
	padding: 20px;
}
.search-list-body .search-list-table >>> td{
	padding: 8px 0;
}
.search-list-body .search-list-table >>> .el-table__row--striped td{
	background-color: #eee;
}
.search-list-body .search-list-table >>> .el-table__header-wrapper th{
	background-color: #ddd;
	color: black;
}
.row-operate-btn{
	font-size: 12px;
	color: #0096eb;
	cursor: pointer;
}
.orderCondition{
	display: inline-flex;
	align-items: center;
	font-size: 14px;
	margin:0 20px 0 auto;

}
.popover-entry{
	border:1px solid #0096eb;
	border-radius: 4px;
	height: 33px;
	display: flex;
	align-items: center;
}
.iconActive{
	color: #0096eb;
	font-weight: 600;
}
.iconNotActive{
	color: #ccc;
}
.el-dropdown-menu__item{
	padding: 0 20px 0 10px;
}
</style>