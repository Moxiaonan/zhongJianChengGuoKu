<template>
	<div>
		<input type="file" name="" id='file-choose-input'  style="display:none" ref="fileinputref" @change="uploadChoosen">
		<form id="download-file-form"  method="post" style="display:none;" 
		 enctype="multipart/form-data">
			<input type="hidden" name="isDir">
			<input type="hidden" name="downloadFileUrl">
			<input type="hidden" name="downloadFileName">
		</form>
		<div class="info-title info-file-title">
			<div style="font-size: larger;font-weight: 600;">{{titleName}}</div>
			<div class="add-operate-north" v-if="(currAccessoryList.length || uploadingMap.length) && editable">
				<span @click='showUploadDialog'>+ 添加文件</span>&nbsp;&nbsp;
				<el-popover ref="popnewfolder" placement="left" 
					width="300" trigger="click" v-model="popNewFolderShow">
				  <el-input placeholder="请输入文件夹名" ref="newfolderinput" v-model="newFolderInput"></el-input>
				  <div style="text-align: right; margin: 10px 5px 5px 5px">
				    <el-button type="primary" size="mini" @click="newFolder">确定</el-button>
				    <el-button size="mini" type="text" @click="popNewFolderShow = false">取消</el-button>
				  </div>
				  <div slot="reference">
				  	<span>添加文件夹</span>
		          </div>
				</el-popover>
				<!-- <span>添加文件夹</span> -->
			</div>
		</div>
		<div class="file-nav">
			<div class="base-operate">
				<span @click="backLastFolder" style="cursor:pointer;">返回上一级</span>
			</div>
			&nbsp;|&nbsp;
			<div class="breadcrumb-area">
				<!-- <el-breadcrumb separator="/">
				  <el-breadcrumb-item v-for="(item,index) in currDirSplit" v-if="item" :key="index" 
				  @click:native="navClick(item,index)">{{item==rootUuid?'首页':item}}</el-breadcrumb-item>
				</el-breadcrumb> -->
				<div class="breadcrumb-item" v-for="(item,index) in currDirSplit" v-if="item" :key="index" 
				@click="navClick(item,index)">
					<span>{{item==rootUuid?'首页':item}}</span>
					<span>{{index==currDirSplit.length-1?'':' > '}}</span>
				</div>
			</div>
		</div>
		<div class="add-operate-middle" v-if="!currAccessoryList.length && !uploadingMap.length">
			<div v-if="editable">
				<span @click='showUploadDialog'>+ 添加文件</span>
				&nbsp;<span style="color:black">或</span>&nbsp;
				<el-popover ref="popnewfolder" placement="top" 
				width="300" trigger="click" v-model="popNewFolderShow">
				  <el-input placeholder="请输入文件夹名" ref="newfolderinput" v-model="newFolderInput"></el-input>
				  <div style="text-align: right; margin: 10px 5px 5px 5px">
				    <el-button type="primary" size="mini" @click="newFolder">确定</el-button>
				    <el-button size="mini" type="text" @click="popNewFolderShow = false">取消</el-button>
				  </div>
				  <div slot="reference">
				  	<span>添加文件夹</span>
		          </div>
				</el-popover>
			</div>
			<span v-if="!editable">无文件</span>
		</div>
		
		<div class="info-file-body" v-if="currAccessoryList.length || uploadingMap.length">
			<transition-group name="list-complete" tag="div">
				<div class="file-item uploading-pane" v-for="(item,key,index) in uploadingMap" :key="key" v-if="key != 'length'">
					<div class="file-item-img">
						<!-- <img src="../static/img/pic.png"> -->
						<img :src="fileIconPath(item.fileName,0)">
					</div>
					<div class="file-item-info">
						<div class="file-item-info-north">{{item.fileName}}</div>
						<div class="file-item-info-south">{{item.fileSize}}</div>
					</div>
					<div class="uploading-pane-progress" :style="{width:item.percentage}">
					</div>
				</div>
			</transition-group>
			<transition-group name="list-complete" tag="div">
				<div class="file-item uploaded-pane" v-for="(item,index) in currAccessoryList" @click="fileItemClick(item,index,$event)" @mouseenter="fileItemMouseenter(item,$event)" @mouseleave="fileItemMouseleave(item,$event)" :key="index" style="cursor:pointer;">
					<div class="file-item-img">
						<!-- <img src="/static/img/pic.png"> -->
						<img :src="fileIconPath(item.accessoryName,item.accessoryIsDir)">
						<!-- <img :src="'../static/img/word.png'"> -->
						<!-- <img :src="ff['a']"> -->
					</div>
					<div class="file-item-info">
						<div class="file-item-info-north">{{item.accessoryName}}</div>
						<div class="file-item-info-south">{{item.accessoryOwner}}&nbsp;&nbsp;{{item.accessoryIsDir?'创建于':'上传于'}}：{{item.uploadTime}}</div>
					</div>
					<div class="file-item-btn" :style="{opacity:item.isHover==undefined?0:item.isHover}">
						<i class="el-icon-download" style="color:#0096eb;font-size: 20px;margin-right:20px;cursor:pointer" title="下载" @click.stop="downloadAccessory(item)"></i>
						<el-popover
							  placement="left"
							  width="160"
							 trigger="click"
							 v-model="item.delPopShow">
							  <p>删除文件：{{item.accessoryName}} ?</p>
							  <div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="item.delPopShow = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="confirmDel(item)">确定</el-button>
							  </div>
							  <i v-if="editable" class="el-icon-delete" style="color:red;font-size: 20px;margin-right:20px;cursor:pointer" title="删除" @click="item.delPopShow = true"
							   slot="reference"></i>
						</el-popover>
						<!-- <i v-if="editable" class="el-icon-delete" style="color:red;font-size: 20px;margin-right:20px;cursor:pointer" title="删除" @click.stop="deleteAccessory(item)"></i> -->
					</div>
					<img  :id="'img' + item.accessoryId" :alt="item.accessoryName" style="display:none;" v-if="fileIsImg(item.accessoryName)">
				</div>
			</transition-group>
		</div>
	</div>
</template>
<script>
	// import UrlConfig from '../urlConfig.js';
	// var UrlConfig = this.urlConfig;
	import GetFtoken from '../getFtoken.js';
	import FileIconMap from '../fileIconMap.js';
	export default{
		data(){
			return {
				titleName:this.accessoryTitleName,
				rootUuid:'',
				currDir:'',
				currDirId:'',
				currAccessoryList:[
				],
				uploadingMap:{
					length:0
				},
				popNewFolderShow:false,
				newFolderInput:'',
			};
		},
		methods:{
			// uploadChoosen2(){
			// 	console.log(this);
			// },
			showUploadDialog(){
				// 会引起this指向错误，不要用
				// document.getElementById('file-choose-input').click();
				this.$refs.fileinputref.dispatchEvent(new MouseEvent('click'));
			},
			uploadChoosen(e){
				var files = e.currentTarget.files;
				for (var i = files.length - 1; i >= 0; i--) {
					var fileSizeStr = this.convertFileSize(files[i].size);
					var fileInfo = {fileName:files[i].name,fileSize:fileSizeStr,percentage:'0%'};
					let fileInfoKey = (new Date()).valueOf();
					// this.uploadingMap[fileInfoKey] = fileInfo;
					this.$set(this.uploadingMap,fileInfoKey,fileInfo);
					this.$set(this.uploadingMap,'length',this.uploadingMap['length'] + 1);
					let fd = new FormData();
					let uploadXhr = new XMLHttpRequest();
					fd.append('file',files[i]);
					fd.append('currDir',this.currDir);
					fd.append('currDirId',this.currDirId);
					var vueRef = this;
					uploadXhr.upload.addEventListener('loadstart',function(e){
						this.addEventListener('progress',function(e){
							if (e.lengthComputable) {
								var percentage = Math.round((e.loaded * 100) / e.total);
								vueRef['uploadingMap'][fileInfoKey]['percentage'] = percentage + '%';
							}
						})
						this.addEventListener('load',function(e){
							
						});
						this.addEventListener("error", function(e) {

						});
					});
					uploadXhr.onreadystatechange = function(){
						if(uploadXhr.readyState == 4){
							if (uploadXhr.status == 200) {
								vueRef.$delete(vueRef['uploadingMap'],fileInfoKey.toString());
								vueRef.$set(vueRef.uploadingMap,'length',vueRef.uploadingMap['length'] - 1);
								vueRef.getCurrDirFile();
							} else {}
						} else {}
					}
					uploadXhr.open('POST',this.urlConfig.uploadFileUrl);
					uploadXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
					uploadXhr.send(fd);
				}
				var objFile=document.getElementById('file-choose-input');   
				objFile.value="";  
			},
			convertFileSize(size){
				var sizeStr = "";
				if(size < 1024 && size >= 0){
					sizeStr = size + "B";
				}else if(size >= 1024 && size < 1048576){
					var sizeDou = size / 1024;
					sizeStr = sizeDou.toFixed(2) + "KB";
				}else if(size >= 1048576 && size < 1073741824){
					var sizeDou = size / 1048576;
					sizeStr = sizeDou.toFixed(2) + "MB";
				}else if(size >= 1073741824){
					var sizeDou = size / 1073741824;
					sizeStr = sizeDou + "GB";
				}
				return sizeStr;
			},
			getCurrDirFile(){
				var getFileXhr = new XMLHttpRequest();
				getFileXhr.responseType = 'json';
				var vueRef = this;
				getFileXhr.onreadystatechange = function(){
					if (getFileXhr.readyState == 4) {
						if (getFileXhr.status) {
							vueRef.currAccessoryList = getFileXhr.response;
							// 应对面包屑导航中currDirId和currDir只有一个的情况，药保证这两个同时有
							if(vueRef.currAccessoryList.length > 0){
								if(vueRef.currAccessoryList[0]['parentId']){
									vueRef.currDirId = vueRef.currAccessoryList[0]['parentId'];
								}
								if (vueRef.currAccessoryList[0]['parentUri']) {
									vueRef.currDir = vueRef.currAccessoryList[0]['parentUri']
								}
							}
						} else {}
					} else {}
				};
				getFileXhr.open('POST',this.urlConfig.getCurrDirFileUrl);
				getFileXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
				getFileXhr.setRequestHeader('Content-Type','application/json');
				var currDirInfo = {currDir:this.currDir,currDirId:this.currDirId};
				getFileXhr.send(JSON.stringify(currDirInfo));
			},
			newFolder(){
				var folderInfo = {
					folderName:this.newFolderInput,
					currDir:this.currDir,
					currDirId:this.currDirId
				}
				var newFolderXhr = new XMLHttpRequest();
				newFolderXhr.responseType = 'json';
				newFolderXhr.onreadystatechange = ()=>{
					if (newFolderXhr.readyState == 4) {
						if (newFolderXhr.status == 200) {
							console.log('-------newFolder---------');
							console.log(newFolderXhr.response);
							this.getCurrDirFile();
							this.popNewFolderShow = false;
							this.newFolderInput = '';
						} else {}
					} else {}
				}
				newFolderXhr.open('POST',this.urlConfig.newFolderUrl);
				newFolderXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
				newFolderXhr.setRequestHeader('Content-Type','application/json');
				newFolderXhr.send(JSON.stringify(folderInfo));
			},
			fileIconPath(fileName,isDir){
				var dotIndex = fileName.lastIndexOf('.');
				if(isDir == 1){
					// return this.gg['folder'];
					return FileIconMap['folder'];
				}else{
					if (dotIndex == -1) {
						// return this.gg['.unknow'];
						return FileIconMap['.unknow'];
					} else {
						var extName = fileName.substring(dotIndex);
						// return this.gg[extName];
						if (FileIconMap[extName]) {
							return FileIconMap[extName];
						} else {
							return FileIconMap['.unknow'];
						}
					}
				}
			},
			fileItemClick(item,index,event){
				if(event.srcElement.className.indexOf('el-icon-delete') == -1){
					if(item.accessoryIsDir){
						this.currDir = item.accessoryUri;
						this.currDirId = item.accessoryId;
						this.getCurrDirFile();
					}else{
						if(this.fileIsImg(item.accessoryName)){
							var imgBasePath = this.urlConfig.imgPath;
							var viewer = new this.Viewer(document.getElementById('img'+item.accessoryId),{
								url(){
									return imgBasePath + item.accessoryUri;
								},
								hidden(){
									this.viewer.destroy();
								},
								navbar:false
							});
							viewer.show();
						}else{
							this.downloadAccessory(item);
						}
					}
				}
			},
			navClick(item,index){
				if(index + 1 == this.currDirSplit.length){

				}else{
					var thisPath = this.currDirSplit.slice(0,index).join('/') + '/' + item;
					console.log(thisPath);
					this.currDir = thisPath;
					this.currDirId = '';
					this.getCurrDirFile();
				}
			},
			backLastFolder(){
				if(this.currDirSplit.length>2){
					var thisPath = this.currDirSplit.slice(0,-1).join('/');
					console.log(thisPath);
					this.currDir = thisPath;
					this.currDirId = '';
					this.getCurrDirFile();
				}
			},
			fileItemMouseenter(item,event){
				this.$set(item,'isHover',1);
				// this.$set(item,'delPopShow',false);
				// this.$set(item,'delPopShow',true);
				// console.log('+++++++over+++++++');
				// console.log(event);
			},
			fileItemMouseleave(item,event){
				this.$set(item,'isHover',0);
				// this.$set(item,'delPopShow',false);
				// if (event.fromElement.className == 'file-item uploaded-pane') {
				// 	// this.$set(item,'delPopShow',false);
				// 	console.log('in');
				// } else {}
				// console.log('--------out-------');
				// console.log(event);
			},
			confirmDel(item){
				this.deleteAccessory(item);
			},
			deleteAccessory(item){
				var delAccessoryXhr = new XMLHttpRequest();
				delAccessoryXhr.responseType = 'text';
				delAccessoryXhr.onreadystatechange = ()=>{
					if (delAccessoryXhr.readyState == 4) {
						if (delAccessoryXhr.status == 200) {
							var resp = delAccessoryXhr.response;
							if (resp == '删除成功') {
								this.getCurrDirFile();
							} else {}
						} else {}
					} else {}
				};
				delAccessoryXhr.open('POST',this.urlConfig.delAccessoryUrl);
				delAccessoryXhr.setRequestHeader('Content-Type','application/json');
				delAccessoryXhr.setRequestHeader('ftoken',GetFtoken.ftoken);
				delAccessoryXhr.send(JSON.stringify(item));
			},
			downloadAccessory(item){
				// this.currDownloadIsDir = item.accessoryIsDir;
				// this.currDownloadUrl = item.accessoryUri;
				// this.downloadUrl = this.urlConfig.downloadFileUrl;
				document.getElementById('download-file-form').action = this.urlConfig.downloadFileUrl;
				document.getElementById('download-file-form')['0'].value = item.accessoryIsDir;
				document.getElementById('download-file-form')['1'].value = item.accessoryUri;
				document.getElementById('download-file-form')['2'].value = item.accessoryName;
				document.getElementById('download-file-form').target = '';
				document.getElementById('download-file-form').submit();
			},
			clearData(){
				this.rootUuid='';
				this.currDir='';
				this.currDirId='';
				this.currAccessoryList=[
				];
				this.uploadingMap={
					length:0
				};
				this.popNewFolderShow=false;
				this.newFolderInput='';
				this.getRandomUuid();
			},
			getRandomUuid(){
				var getUuidXhr = new XMLHttpRequest();
				getUuidXhr.responseType = 'text';
				var vueRef = this;
				getUuidXhr.onreadystatechange = function(){
					if (getUuidXhr.readyState == 4) {
						if (getUuidXhr.status == 200) {
							vueRef.rootUuid = getUuidXhr.response;
							vueRef.currDir = '/' + vueRef.rootUuid;
							vueRef.currDirId = vueRef.rootUuid;
						} else {}
					} else {}
				}
				getUuidXhr.open('POST',this.urlConfig.getUuidUrl);
				getUuidXhr.send();
			},
			getFileExtName(fileName){
				var dotIndex = fileName.lastIndexOf('.');
				if (dotIndex == -1) {
					return '';
				}else{
					return fileName.substr(dotIndex).toUpperCase();
				}
			},
			fileIsImg(fileName){
				var imgExtArr = ['.JPG','.PNG','.BMP','.GIF','.JPEG'];
				var extName = this.getFileExtName(fileName);
				if (imgExtArr.indexOf(extName) == -1) {
					return false;
				}else{
					return true;
				}
			}
		},
		created(){
			if (!this.initUuid) {
				this.getRandomUuid();
			}else{
				this.rootUuid = this.initUuid;
				this.currDir = '/' + this.initUuid;
				this.currDirId = this.initUuid;
				this.getCurrDirFile();
			}
			console.log('---------accessory-manage-created--------');
		},
		mounted(){
			console.log('---------accessory-manage-mounted--------');
		},
		computed:{
			currDirSplit(){
				var splitArr = this.currDir.split("/");
				return splitArr;
			}
		},
		props:['initUuid','accessoryTitleName',"editable"]
	}
</script>
<style scoped>
.info-title {
	border-left: 18px #0096eb solid;
    padding: 5px 0px 5px 15px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}
.info-file-body{
	border-top: 1px solid #ddd;
}
.info-file-body .file-item{
	display: flex;
	padding:5px 15px;
	margin: 5px 0px;
}
.info-file-body .file-item.uploaded-pane:hover{
	background-color: rgba(0,0,0,0.1);
}
.info-file-body .file-item .file-item-info{
	display: inline-flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 5px;
}
.info-file-body .file-item.uploading-pane{
	position: relative;
}
.info-file-body .file-item.uploading-pane .uploading-pane-progress{
	position: absolute;
	width: 0%;
	height: 100%;
	background-color:  rgba(0,150,235,0.1);
	top: 0;
	left: 0;
}
.info-file-body .file-item .file-item-info .file-item-info-south{
	color: #bbb;
}
.add-operate-north{
	font-size: 14px;
	color: #0096eb;
	cursor: pointer;
}
.add-operate-middle{
	min-height: 150px;
    border: 1px solid #0096ed;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
	color: #0096eb;
	cursor: pointer;
}
.add-operate-middle >>> .el-popover__reference,
.add-operate-north >>> .el-popover__reference{
	display: inline-block;
}
.no-accessory-msg{
	display: flex;
	justify-content: center;
	align-items: center;
}
.file-item.uploading-pane,.file-item.uploaded-pane {
  transition: all 1s;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}
/*.list-complete-leave-active {
  position: absolute;
}*/
.file-nav{
	padding: 5px;
	display: flex;
	align-items: center;
}
.file-nav .base-operate{
	color: #0096eb;
	font-size: 14px;
}
.file-nav .breadcrumb-area{
	display: flex;
	font-size: 14px;
}
.file-nav .breadcrumb-area .breadcrumb-item span:first-child:hover{
	color: #0096eb;
	cursor: pointer;
}
.file-nav .breadcrumb-area .breadcrumb-item:last-child:hover{
	color: black;
	cursor: default;
}
.file-item-btn{
	margin-left: auto;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>