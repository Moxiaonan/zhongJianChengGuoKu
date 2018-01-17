<template>
	<div class="theme-info">
		<div class="theme-info-basic">
			<div class="info-title theme-info-basic-title">
				<span>添加主题</span>
			</div>
			<div class="theme-info-basic-form">
				<el-input placeholder="请输入内容" v-model="themeName">
				    <template slot="prepend">主题名称:</template>
				</el-input>
				<el-input placeholder="请输入内容" v-model="themeDesignUnit">
				    <template slot="prepend">设计单位:</template>
				</el-input>
			</div>
		</div>
		<div class="theme-info-accessory">
			<accessory-manage accessory-title-name="添加附件" ref="accessorymanageref" :init-uuid="initUuid"
			 :editable="accessoryEditable"></accessory-manage>
		</div>
		<div class="theme-info-remark">
			<div class="info-title theme-info-remark-title">
				<span>会议定论</span>
			</div>
			<div class="theme-info-remark-input">
				<el-input
				  type="textarea"
				  :autosize="{ minRows: 5, maxRows: 7}"
				  placeholder="请输入内容"
				  v-model="themeConclusion">
				</el-input>
			</div>
		</div>
		<div class="theme-info-btn" v-if="themeAction != 'watch'">
			<el-button type="primary" plain @click="notKeepDialog">保存</el-button>
			<el-button type="primary" plain @click="keepDialog" v-if="themeAction != 'editAlterDirect'">保存并新增</el-button>
			<el-button plain @click="cancle" v-if="themeAction != 'editAlterDirect'">取消</el-button>
		</div>
	</div>
</template>
<script >
	// import UrlConfig from '../urlConfig.js';
	// var UrlConfig = this.urlConfig;
	import GetFtoken from '../getFtoken.js';
	export default{
		data(){
			return {
				themeId:'',
				themeName:'',
				themeDesignUnit:'',
				themeConclusion:'',
				initUuid:'',
				themeAction:'add',
				keepShow:false
				// ctrlAccessoryRerender:true
			};
		},
		methods:{
			saveTheme(){
				var themeObj = {
					themeId:this.themeId,
					themeName:this.themeName,
					themeDesignUnit:this.themeDesignUnit,
					themeConclusion:this.themeConclusion,
					themeAccessory:{accessoryId:this.$refs['accessorymanageref'].rootUuid}
				};
				var emitData = {
					isKeepDialog:this.keepShow
				};
				if (this.themeAction == 'add') {
					emitData.themeObj = themeObj;
					this.$emit('themeSaved',emitData);
				} else if(this.themeAction == 'alter'){
					emitData.themeObj = themeObj;
					this.$emit('themeAlter',emitData)
				}else if(this.themeAction == 'editAdd'){
					themeObj.themeMeeting = {meetingId:this.meetingId};
					var insertThemeXhr = new XMLHttpRequest();
					insertThemeXhr.responseType = 'json';
					insertThemeXhr.onreadystatechange = ()=>{
						if (insertThemeXhr.readyState == 4) {
							if (insertThemeXhr.status == 200) {
								emitData.themeObj = insertThemeXhr.response;
								this.$emit('themeInsert',emitData);
							} else {}
						} else {}
					}
					insertThemeXhr.open('POST',this.urlConfig.insertThemeUrl);
					insertThemeXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
					insertThemeXhr.setRequestHeader('Content-Type','application/json');
					themeObj.projectType = this.prjType;
					insertThemeXhr.send(JSON.stringify(themeObj));
				}else if(this.themeAction == 'editAlter'){
					var alterThemeXhr = new XMLHttpRequest();
					alterThemeXhr.responseType = 'json';
					alterThemeXhr.onreadystatechange = ()=>{
						if (alterThemeXhr.readyState == 4) {
							if (alterThemeXhr.status == 200) {
								emitData.themeObj = alterThemeXhr.response;
								this.$emit('themeUpdate',emitData);
							} else {}
						} else {}
					}
					alterThemeXhr.open('POST',this.urlConfig.alterThemeUrl);
					alterThemeXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
					alterThemeXhr.setRequestHeader('Content-Type','application/json');
					themeObj.projectType = this.prjType;
					alterThemeXhr.send(JSON.stringify(themeObj));
				}else if(this.themeAction == 'editAlterDirect'){
					var alterThemeXhr = new XMLHttpRequest();
					alterThemeXhr.responseType = 'json';
					alterThemeXhr.onreadystatechange = ()=>{
						if (alterThemeXhr.readyState == 4) {
							if (alterThemeXhr.status == 200) {
								this.$message({
									message:'修改主题成功',
									type:'success'
								});
								this.$emit('dynamicEvent',{action:'refreshSearchList'});
							} else {}
						} else {}
					}
					alterThemeXhr.open('POST',this.urlConfig.alterThemeUrl);
					alterThemeXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
					alterThemeXhr.setRequestHeader('Content-Type','application/json');
					themeObj.projectType = this.prjType;
					alterThemeXhr.send(JSON.stringify(themeObj));
				}
			},
			clearData(){
				this.themeId='';
				this.themeName='';
				this.themeDesignUnit='';
				this.themeConclusion='';
				this.initUuid='';
			},
			keepDialog(){
				this.keepShow = true;
				this.saveTheme();
				this.clearData();
				if (this.themeAction == 'add' || this.themeAction == 'alter') {
					this.themeAction = 'add';
				} else if(this.themeAction == 'editAdd' || this.themeAction == 'editAlter'){
					this.themeAction = 'editAdd';
				}
				this.$refs['accessorymanageref'].clearData();
			},
			notKeepDialog(){
				this.keepShow = false;
				this.saveTheme();
			},
			cancle(){
				this.$emit("cancle");
			}
		},
		created(){
			console.log('---------theme-info-created--------');
			if (this.someData) {
				this.themeAction = this.someData.themeAction;
				this.themeId = this.someData.existThemeobj.themeId;
				this.themeName = this.someData.existThemeobj.themeName;
				this.themeDesignUnit = this.someData.existThemeobj.themeDesignUnit;
				this.themeConclusion = this.someData.existThemeobj.themeConclusion;
				this.initUuid = this.someData.existThemeobj.themeAccessory.accessoryId;
			} else {}
			if (this.existThemeobj) {
				this.themeAction = this.themeActionProp;
				this.themeId = this.existThemeobj.themeId;
				this.themeName = this.existThemeobj.themeName;
				this.themeDesignUnit = this.existThemeobj.themeDesignUnit;
				this.themeConclusion = this.existThemeobj.themeConclusion;
				this.initUuid = this.existThemeobj.themeAccessory.accessoryId;
			} else {
			}
			if (this.themeActionProp) {
				this.themeAction = this.themeActionProp;
			} else {}
		},
		mounted(){
			console.log('---------theme-info-mounted--------');
		},
		computed:{
			accessoryEditable(){
				var editable = 0;
				if (this.themeAction == 'watch') {
					editable = 0;
				} else {
					editable = 1;
				}
				return editable;
			}
		},
		props:['existThemeobj','themeActionProp','meetingId','someData']
	}
</script>
<style scoped>
.theme-info > div{
	margin: 30px auto;
	width: 80%;
}
.info-title {
	border-left: 18px #0096eb solid;
    font-size: larger;
    padding: 5px 15px;
    font-weight: 600;
    margin-bottom: 10px;
}
.theme-info-basic-form .el-input{
	margin: 10px 0px;
}
.theme-info-basic-form .el-input >>> .el-input-group__prepend{
	border:0px solid transparent;
	color: black;
	background-color: transparent;
}
.theme-info-basic-form .el-input >>> .el-input-group__prepend,
.theme-info-basic-form .el-input >>> .el-input__inner{
	height: 30px;
}
.theme-info-btn{
	display: flex;
	justify-content: flex-end;
}
</style>