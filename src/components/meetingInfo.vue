<template>
	<div class="meeting-info">
		<div class="info-create">
			<div class="info-title info-create-title">
				创建会议
			</div>
			<div class="info-create-body">
				<el-input v-model="meetingName">
				    <template slot="prepend">会议名称:</template>
				</el-input>
				<!-- <el-input v-model="">
				    <template slot="prepend">会议时间:</template>
				</el-input> -->
				<div class="time-pane">
					<span style="padding: 0 20px;">会议时间:</span>
					<el-date-picker type="datetime" placeholder="" align="left" v-model="meetingTime" :time-arrow-control="true" value-format="yyyy-MM-dd HH:mm:ss">
				    </el-date-picker>
				</div>
				<el-input v-model="meetingCompere">
				    <template slot="prepend">主持人:</template>
				</el-input>
				<div style="display:flex;margin:15px 0px;font-size: 16px;">
					<div style="width:70px;padding:0px 20px;display:inline-flex;">参会人员:</div>
					<div style="flex:1 1 auto;font-size:16px;">
						<el-input v-model="meetingParticipator" type="textarea" :autosize="{ minRows: 2}"
						>
						</el-input>
					</div>
				</div>
			</div>
		</div>
		<div class="info-content">
			<div class="info-title info-content-title">
				会议内容
			</div>
			<el-dialog title="主题" :visible.sync="themeDialogShow" top="5vh" width="80%" ref="themeDialogRef" @open="themeDialogOpen" @close="themeDialogClose">
				<theme-info @themeSaved="doThemeSave" @themeAlter="doThemeAlter" v-if="themeDialogShow" :exist-themeobj="existThemeobj" @themeInsert="doThemeInsert" @themeUpdate="doThemeUpdate"
				 :theme-action-prop="themeAction" :meeting-id="meetingId" @keepDialog="doKeepDialog" @cancle="doThemeCancle"></theme-info>
				<!-- <theme-info @themeSaved="doThemeSave" :alter-themeobj="existThemeobj"></theme-info> -->
			</el-dialog>
			<div class="info-content-body">
				<div class="info-content-body-header">
					<span class="theme-count">共{{tableData.length}}个主题</span>
					<span class="add-theme" @click="addTheme" v-if="action != 'watch'">+ 添加主题</span>
				</div>
				<div>
					<el-table :data="tableData" stripe style="width: 100%" class="content-list-table" @row-click="watchTheme">
					    <el-table-column prop="themeName" label="主题" min-width.="50"></el-table-column>
					    <el-table-column prop="themeDesignUnit" label="设计单位" min-width="30"></el-table-column>
					    <el-table-column label="定论" width="80">
					    	<template slot-scope="scope">
						        <el-popover trigger="hover" placement="left" width="300">
						          <span>{{ scope.row.themeConclusion }}</span>
						          <div slot="reference" class="name-wrapper">
						            <el-tag size="medium">查看</el-tag>
						          </div>
						        </el-popover>
						    </template>
					    </el-table-column>
					    <el-table-column label=" " width="80" v-if="action != 'watch'">
					    	<template slot-scope="scope">
					    		<el-popover
								  placement="left"
								  width="160"
								 trigger="click"
								 v-model="scope.row.delPopShow">
								  <p>删除主题：{{scope.row.themeName}} ?</p>
								  <div style="text-align: right; margin: 0">
								    <el-button size="mini" type="text" @click="scope.row.delPopShow = false">取消</el-button>
								    <el-button type="primary" size="mini" @click="confirmDel(scope.$index, tableData)">确定</el-button>
								  </div>
							      <i class="el-icon-delete" style="color:red;" @click="scope.row.delPopShow = true" slot="reference">
							      </i>
								</el-popover>
						    	<!-- <i class="el-icon-delete" style="color:red;" @click.stop="delTheme(scope.$index, tableData)">
						    	</i> -->
						    	&nbsp;&nbsp;
						    	<i class="el-icon-edit" style="color:#0096eb;" 
						    		@click.stop="alterTheme(scope.$index, tableData)">
						    	</i>

					    	</template>
					    </el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<div class="info-file">
			<accessory-manage accessory-title-name="会议纪要文件" ref="accessorymanageref" 
			 :init-uuid="initUuid" :editable="accessoryEditable" v-if="accessoryManageShow"></accessory-manage>
		</div>
		<div class="meeting-info-btn" v-if="action != 'watch'">
			<el-button type="primary" plain @click="saveMeetingInfo">保存</el-button>
			<el-button plain @click="cancle">取消</el-button>
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
				tableData:[
				],
				themeDialogShow:false,
				existThemeobj:'',
				themeAction:'',
				alterThemeIndex:'',
				meetingName:'',
				meetingCompere:'',
				meetingTime:'',
				meetingParticipator:'',
				meetingId:'',
				initUuid:'',
				accessoryEditable:1,
				action:'new',
				accessoryManageShow:0
			};
		},
		methods:{
			addTheme(){
				if (this.action == 'new') {
					this.themeAction = 'add';
				} else if(this.action == 'edit'){
					this.themeAction = 'editAdd';
				}
				this.themeDialogShow = true;
			},
			doThemeSave(data){
				this.tableData.push(data.themeObj);
				if(data.isKeepDialog){
					this.themeDialogShow = true;
				}else{
					this.themeDialogShow = false;
				}
			},
			doKeepDialog(){
				// this.themeDialogShow = true;
			},
			themeDialogOpen(){ 
				// console.log(this.$refs['themeDialogRef']);
				// this.$refs['themeDialogRef'].$children[0].ctrlAccessoryRerender = true;
			},
			themeDialogClose(){
				this.existThemeobj = '';
				this.alterThemeIndex = '';
			},
			confirmDel(index, rows){
				this.delTheme(index, rows);
				this.delPopShow = false;
			},
			delTheme(index, rows){
				if (this.action == 'new') {
					rows.splice(index,1);
				} else if(this.action == 'edit'){
					var deleteThemeXhr = new XMLHttpRequest();
					deleteThemeXhr.responseType = 'json';
					deleteThemeXhr.onreadystatechange = ()=>{
						if (deleteThemeXhr.readyState == 4) {
							if (deleteThemeXhr.status == 200) {
								rows.splice(index,1);
								this.$message({
						          message: '删除成功',
						          type: 'success'
						        });
								this.$emit('dynamicEvent',{action:'refreshSearchList'});
							} else {}
						} else {}
					}
					deleteThemeXhr.open('POST',this.urlConfig.deleteThemeUrl);
					deleteThemeXhr.setRequestHeader('Content-Type','application/json');
					deleteThemeXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
					rows[index].projectType = this.prjType;
					deleteThemeXhr.send(JSON.stringify(rows[index]));
				}
			},
			alterTheme(index, rows){
				this.existThemeobj = rows[index];
				if (this.action == 'new') {
					this.themeAction = 'alter';
				} else if(this.action == 'edit'){
					this.themeAction = 'editAlter';
				}
				this.themeDialogShow = true;
				this.alterThemeIndex = index;
			},
			watchTheme(row, event, column){
				if (event.srcElement.className.indexOf('el-icon-delete') == -1) {
					if(this.action == 'watch'){
						var themeInfo = {
							action:'watchThemeDetail',
							theme:row
						}
						this.$emit('dynamicEvent',themeInfo);
					}else{
						this.themeAction = 'watch';
						this.tableData.indexOf(row);
						this.existThemeobj = row;
						this.themeDialogShow = true;
					}
				}

			},
			doThemeAlter(data){
				this.tableData.splice(this.alterThemeIndex,1,data.themeObj);
				if(data.isKeepDialog){
					this.themeDialogShow = true;
				}else{
					this.themeDialogShow = false;
				}
			},
			saveMeetingInfo(){
				this.accessoryManageShow = 0;
				var meetingInfoObj = {};
				meetingInfoObj.meetingName = this.meetingName;
				meetingInfoObj.meetingCompere = this.meetingCompere;
				meetingInfoObj.meetingTime = this.meetingTime;
				meetingInfoObj.meetingParticipator = this.meetingParticipator;
				if (this.action == "new") {
					meetingInfoObj.meetingAccessory = {accessoryId:this.$refs['accessorymanageref'].rootUuid};
					if (this.tableData.length) {
						meetingInfoObj.themeList = this.tableData;
					} else {}
					var insertMeetingXhr = new XMLHttpRequest();
					insertMeetingXhr.responseType = 'text';
					insertMeetingXhr.onreadystatechange = ()=>{
						if (insertMeetingXhr.readyState == 4) {
							if (insertMeetingXhr.status == 200) {
								console.log(insertMeetingXhr.response);
								this.action = 'watch';
								this.themeAction = 'watch';
								this.$message({
						          message: '保存成功',
						          type: 'success'
						        });
						        this.initUuid = meetingInfoObj.meetingAccessory.accessoryId;
						        this.accessoryManageShow = 1;
						        this.accessoryEditable = 0;
						        this.$emit('dynamicEvent',{action:'refreshSearchList'});
							} else {}
						} else {}
					};
					insertMeetingXhr.open('POST',this.urlConfig.insertMeetingUrl); 
					insertMeetingXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
					insertMeetingXhr.setRequestHeader('Content-Type','application/json');
					meetingInfoObj.projectType = this.prjType;
					insertMeetingXhr.send(JSON.stringify(meetingInfoObj));
				} else if(this.action == "edit"){
					meetingInfoObj.meetingId = this.meetingId;
					var editMeetingXhr = new XMLHttpRequest();
					editMeetingXhr.responseType = 'text';
					editMeetingXhr.onreadystatechange = ()=>{
						if (editMeetingXhr.readyState == 4) {
							if (editMeetingXhr.status == 200) {
								console.log(editMeetingXhr.response);
								this.action = 'edit';
								this.themeAction = 'edit';
								this.$message({
						          message: '编辑成功',
						          type: 'success'
						        });
						        this.accessoryManageShow = 1;
						         this.accessoryEditable = 1;
						         this.$emit('dynamicEvent',{action:'refreshSearchList'});
							} else {}
						} else {}
					};
					editMeetingXhr.open('POST',this.urlConfig.editMeetingUrl); 
					editMeetingXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
					editMeetingXhr.setRequestHeader('Content-Type','application/json');
					meetingInfoObj.projectType = this.prjType;
					editMeetingXhr.send(JSON.stringify(meetingInfoObj));
				}
				
			},
			doThemeInsert(data){
				this.$message({
					showClose: true,
		            message: '添加主题成功',
		            type: 'success'
				});
				this.tableData.push(data.themeObj);
				if(data.isKeepDialog){
					this.themeDialogShow = true;
				}else{
					this.themeDialogShow = false;
				}
				this.$emit('dynamicEvent',{action:'refreshSearchList'});
			},
			doThemeUpdate(data){
				this.$message({
					showClose: true,
		            message: '修改主题成功',
		            type: 'success'
				});
				this.tableData.splice(this.alterThemeIndex,1,data.themeObj);
				if(data.isKeepDialog){
					this.themeDialogShow = true;
				}else{
					this.themeDialogShow = false;
				}
				this.$emit('dynamicEvent',{action:'refreshSearchList'});
			},
			doThemeCancle(){
				this.themeDialogShow = false;
			},
			cancle(){
				var paramObj = {action:'cancleMeeting',componentName:this.someData.componentName}
				this.$emit('dynamicEvent',paramObj);
			}
		},
		props:['someData'],
		created(){
			if(this.someData){
				if (this.someData.meetingAction == 'watch' || this.someData.meetingAction == 'edit') {
					var getMeetingInfoXhr = new XMLHttpRequest();
					// getMeetingInfoXhr.responseType = 'json';
					getMeetingInfoXhr.onreadystatechange = ()=>{
						if (getMeetingInfoXhr.readyState == 4) {
							if (getMeetingInfoXhr.status == 200) {
								var returnData = JSON.parse(getMeetingInfoXhr.response);
								this.tableData = returnData.themeList;  
								this.meetingName = returnData.meetingName;
								this.meetingCompere = returnData.meetingCompere;
								this.meetingTime = returnData.meetingTime;
								this.meetingParticipator = returnData.meetingParticipator;
								this.meetingId = returnData.meetingId;
								this.initUuid = returnData.meetingAccessory.accessoryId;
								this.accessoryManageShow = 1;
								if (this.someData.meetingAction == 'watch') {
									this.accessoryEditable = 0
									this.action = 'watch';
								} else if(this.someData.meetingAction == 'edit'){
									this.accessoryEditable = 1
									this.action = 'edit';
								}
							} else {}
						} else {}
					}
					getMeetingInfoXhr.open('POST',this.urlConfig.getMeetingInfoUrl);
					getMeetingInfoXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
					getMeetingInfoXhr.setRequestHeader('Content-Type','text/plain');
					getMeetingInfoXhr.send(this.someData.meetingInfo.meetingId);
				} else{
					this.accessoryManageShow = 1;
				}
			}
		}
	}
</script>
<style scoped>
.meeting-info > div{
	margin: 40px auto;
    width: 75%;
}
.info-title {
	border-left: 18px #0096eb solid;
    font-size: larger;
    padding: 5px 15px;
    font-weight: 600;
    margin-bottom: 10px;
}
.info-create-body .el-input{
	margin: 10px 0px;
	font-size: 16px;
}
.info-create-body .time-pane{
	display: flex;
	align-items: center;
}
.info-create-body .time-pane span:nth-chile(1){
	display: inline-flex;
	width: 72px;
	justify-content: center;
	align-items: center;
}
.info-create-body .time-pane .el-date-editor{
	flex-grow: 1;
}
.info-create-body .time-pane .el-date-editor >>> .el-input__prefix i{
	display: none;
}
.info-create-body > .el-input >>> .el-input-group__prepend{
	width: 70px;
	background-color: transparent;
	color: black;
	border: 1px solid transparent;
}	
.info-create-body .el-input >>> .el-input__inner{
	border: 0px solid rgba(0,0,0,0);
	border-bottom: 1px solid #ddd;
	height: 30px;
}	
.info-content-body-header{
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
}
.info-content-body-header .add-theme{
	color: #0096eb;
	cursor: pointer;
}
.info-content-body-header .theme-count{
	color: #bbb;
}
.info-content-body .content-list-table >>> td{
	padding: 8px 0;
}
.info-content-body .content-list-table >>> .el-table__row--striped td{
	background-color: #eee;
}
.info-content-body .content-list-table >>> .el-table__header-wrapper th{
	background-color: #ddd;
	color: black;
}
.meeting-info-btn{
	display: flex;
	justify-content: flex-end;
}
</style>