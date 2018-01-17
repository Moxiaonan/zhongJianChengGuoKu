<template>
	<div>
		<div class="search-list-header">
			<div style="display:flex;margin-bottom:10px;">
				<el-input class="advance-keyword-input meeting-name-input"
					  placeholder=""
					  v-model.trim="meetingNameInput"
					  clearable
					  @keydown.enter.native="getTableData(1)">
					  <template slot="prepend">会议名称：</template>
				</el-input>
				<el-input class="advance-keyword-input theme-name-input"
					  placeholder=""
					  v-model.trim="themeNameInput"
					  clearable
					  @keydown.enter.native="getTableData(1)">
					  <template slot="prepend">主题名称：</template>
				</el-input>
			</div>
			<div style="display:flex;margin-bottom:10px;">
				<el-input class="advance-keyword-input design-unit-input"
					  placeholder=""
					  v-model.trim="designUnitInput"
					  clearable
					  @keydown.enter.native="getTableData(1)">
					  <template slot="prepend">设计单位：</template>
				</el-input>
				<el-date-picker class="meeting-time-range"
			      v-model="meetingTimeRangeInput"
			      type="daterange"
			      range-separator="至"
			      start-placeholder="会议开始日期"
			      unlink-panels
			      end-placeholder="会议结束日期"
			      value-format="yyyy-MM-dd HH:mm:ss" >
			    </el-date-picker>
			</div>
			<div style="display:flex;margin-bottom:10px;">
				<el-date-picker class="choose-meeting-time"
			      v-model="chooseMeetingTimeInput"
			      type="date"
			      placeholder="会议日期"
			      value-format="yyyy-MM-dd HH:mm:ss" >
			    </el-date-picker>
			    <div style="display:inline-flex;justify-content:flex-end;width:40%;">
			    	<el-button plain @click="refreshData" icon="el-icon-refresh"></el-button>
					<el-button plain @click="getTableData(1)"style="min-width: 100px;">搜索</el-button>
			    </div>
			</div>
		</div>
		<div class="search-list-body">
			<el-table :data="tableData" stripe style="width: 100%" class="search-list-table" @row-click="rowClickHandle":row-style="rowStyle">
			    <el-table-column prop="themeName" label="主题名称" min-width="35"></el-table-column>
			    <el-table-column prop="themeDesignUnit" label="建设单位" min-width="30"></el-table-column>
			    <el-table-column prop="themeMeeting.meetingName" label="会议名称" min-width="50"></el-table-column>
			    <el-table-column prop="themeMeeting.meetingTime" label="会议日期" min-width="25"></el-table-column>
			    <el-table-column label="定论" min-width="10">
			    	<template slot-scope="scope">
				        <el-popover trigger="hover" placement="left">
				          <div>{{scope.row.themeConclusion}}</div>
				          <div slot="reference">
				            <el-tag size="medium">查看</el-tag>
				          </div>
				        </el-popover>
				     </template>
			    </el-table-column>
			    <el-table-column  label="操作" min-width="10">
			    	<template slot-scope="scope">
				        <span type="text" class="row-operate-btn" @click.stop="editTheme(scope.row)">编辑</span>
				        <el-popover
						  placement="left"
						  width="160"
						 trigger="click"
						 v-model="scope.row.delPopShow">
						  <p>删除主题：{{scope.row.themeName}} ?</p>
						  <div style="text-align: right; margin: 0">
						    <el-button size="mini" type="text" @click="scope.row.delPopShow = false">取消</el-button>
						    <el-button type="primary" size="mini" @click="confirmDel(scope.row)">确定</el-button>
						  </div>
				          <span type="text" class="row-operate-btn" slot="reference" @click="scope.row.delPopShow = true">删除</span>
						</el-popover>
						<!-- <el-button type="text" size="small" @click.stop="deleteTheme(scope.row)">删除</el-button> -->
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
				meetingNameInput:'',
				themeNameInput:'',
				designUnitInput:'',
				meetingNameSearch:'',
				themeNameSearch:'',
				designUnitSearch:'',
				meetingTimeRange:'',
				chooseMeetingTime:'',
				meetingTimeRangeInput:'',
				chooseMeetingTimeInput:'',
				searchPaneShow:0,
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
				}
			}
		},
		methods:{
			getTableData(currPage){
				this.meetingNameSearch = this.meetingNameInput;
				this.themeNameSearch = this.themeNameInput;
				this.designUnitSearch = this.designUnitInput;
				this.meetingTimeRange = this.meetingTimeRangeInput;
				this.chooseMeetingTime = this.chooseMeetingTimeInput;
				var param = {}
				if(this.meetingNameSearch === undefined || this.meetingNameSearch === null || this.meetingNameSearch === ''){
					
				}else{
					param.meetingName = this.meetingNameSearch;
				}
				if(this.themeNameSearch === undefined || this.themeNameSearch === null || this.themeNameSearch === ''){
					
				}else{
					param.themeName = this.themeNameSearch;
				}
				if(this.designUnitSearch === undefined || this.designUnitSearch === null || this.designUnitSearch === ''){
					
				}else{
					param.themeDesignUnit = this.designUnitSearch;
				}

				if(currPage === '' || currPage === undefined || currPage === null){
					param.currPage = 1;
				}else{
					param.currPage = currPage;
				}
				if (this.meetingTimeRange) {
					if (this.meetingTimeRange.length) {
						param.meetingBeginDate = this.meetingTimeRange[0];
						param.meetingEndDate = this.meetingTimeRange[1];
					} else {

					}
				} else {}

				if (this.chooseMeetingTime) {
					param.meetingTime = this.chooseMeetingTime;
				} else {}
				this.sendTableDataXhr(param);
			},
			refreshData(){
				var param = {currPage:1};
				this.sendTableDataXhr(param);
			},
			sendTableDataXhr(param){
				var getTableDataXhr = new XMLHttpRequest();
				getTableDataXhr.responseType = 'json';
				getTableDataXhr.onreadystatechange = ()=>{
					if (getTableDataXhr.readyState == 4) {
						if (getTableDataXhr.status == 200) {
							var pageInfo = getTableDataXhr.response;
							console.log(pageInfo);
							this.tableData = pageInfo.list;
							this.pageParam.totalRow = pageInfo.total;
							this.pageParam.currentPage = pageInfo.pageNum;
							this.pageParam.pageCount = pageInfo.pages;
							this.pageParam.pageSize = pageInfo.pageSize;
						}
					}
				}
				getTableDataXhr.open('POST',this.urlConfig.getThemeDataUrl);
				getTableDataXhr.setRequestHeader('Content-Type','application/json');
				param.projectType = this.prjType;
				getTableDataXhr.send(JSON.stringify(param));
			},
			handleCurrentChange(curr){
				this.getTableData(curr);
			},
			rowClickHandle(row, event, column){
				if (event.srcElement.className.indexOf('row-operate-btn') == -1) {
					var themeDetailObj = {action:'watchThemeDetail',theme:row};
					this.$emit('dynamicEvent',themeDetailObj);
				}
			},
			editTheme(row){
				var themeDetailObj = {action:'editTheme',theme:row};
				this.$emit('createNewTab',themeDetailObj);
			},
			confirmDel(row){
				this.deleteTheme(row);
				row.delPopShow = false;
			},
			deleteTheme(row){
				var deleteThemeXhr = new XMLHttpRequest();
				deleteThemeXhr.responseType = 'text';
				deleteThemeXhr.onreadystatechange = ()=>{
					if (deleteThemeXhr.readyState == 4) {
						if (deleteThemeXhr.status == 200) {
							this.$message({
								message: '删除成功',
						        type: 'success'
							});
							this.getTableData(1);
						} else {}
					} else {}
				}
				deleteThemeXhr.open('POST',this.urlConfig.deleteThemeUrl);
				deleteThemeXhr.setRequestHeader('Content-Type','application/json');
				deleteThemeXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
				row.projectType = this.prjType;
				deleteThemeXhr.send(JSON.stringify(row));
			},
			showSearchPane(){
				this.searchPaneShow = !this.searchPaneShow;
			}
		},
		created(){
			this.getTableData(1);
		}
	}
</script>
<style scoped>
.search-list-header{
	/*display: flex;*/
	padding: 0 20px; 
}
.search-list-header .advance-keyword-input{
	width: 40%;
	margin-right: 20px;
}
.meeting-time-range,
.choose-meeting-time{
	width: 40%;
	margin-right: 20px;
}

.search-list-body{
	padding: 10px 20px;
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
.curtain-enter-active,.curtain-leave-active{
	transition: all .3s;
}
.curtain-enter,.curtain-leave-to{
	opacity: 0;
	transform: translateY(-30px);
}
.search-pane{
	padding: 0px 20px;
}
.row-operate-btn{
	font-size: 12px;
	color: #0096eb;
	cursor: pointer;
}
</style>