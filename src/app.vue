<template>
	<div class="tab-container">
		<el-tabs type="card" v-model="editableTabsValue" closable @tab-remove="removeTab" class="tab-app">
		  <el-tab-pane
		    label="会议列表"
		    name="meetingResultList"
		    :closable="false">
		  	<search-list @createNewTab="createNewTab" ref="meetingResultList" @dynamicEvent="doDynamicEvent"></search-list>
		  </el-tab-pane>
		  <el-tab-pane
		    label="高级搜索"
		    name="themeResultList"
		    :closable="false"
		  >
		  	<theme-search-list @createNewTab="createNewTab" @dynamicEvent="doDynamicEvent" ref="themeResultList"></theme-search-list>
		  </el-tab-pane>
		  <el-tab-pane
		    v-for="(item, index) in editableTabs"
		    :key="index"
		    :name="item.name"
		  >
		  	<div slot='label' style="display:inline-block;">
		  		<el-popover trigger="hover" placement="bottom">
		          <div>{{item.title}}</div>
		          <div slot="reference">
		            <span>{{tabTitleShow(item.title)}}</span>
		          </div>
		        </el-popover>
		  	</div>
		    <component :is="item.componentName" :some-data="item.someData" :ref="item.name" @dynamicEvent="doDynamicEvent">
		    </component>
		  </el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
	export default{
		data(){
			return {
				editableTabsValue:'meetingResultList',
				editableTabs:[
					
				],
				tabnameArr:[],
				tabIndex: 2,
			}
		},
		filters:{

		},
		methods:{
			removeTab(targetName) {
		        let tabs = this.editableTabs;
		        let activeName = this.editableTabsValue;
		        if (activeName === targetName) {
		          tabs.forEach((tab, index) => {
		            if (tab.name === targetName) {
		              let nextTab = tabs[index + 1] || tabs[index - 1];
		              if (nextTab) {
		                activeName = nextTab.name;
		              }
		            }
		          });
		        }
		        if(!activeName || activeName === targetName){
		        	activeName = 'meetingResultList';
		        }
		        this.editableTabsValue = activeName;
		        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
		    },
			createNewTab(data){
				// console.log(data);
				var tabInfo	= {};
				if (data === 'new') {
					tabInfo.title = '新建会议';
					tabInfo.name = 'newRecord' + (new Date()).valueOf();
					tabInfo.componentName = 'meeting-info';
					this.editableTabsValue = tabInfo.name;
					tabInfo.someData = {
						componentName:tabInfo.name
					}
				}else if (data.action == 'watchMeetingDetail') {
					tabInfo.title = '会议:' + data.meeting.meetingName;
					tabInfo.name = 'meetingDetail' + (new Date()).valueOf();
					tabInfo.componentName = 'meeting-info';
					this.editableTabsValue = tabInfo.name;
					tabInfo.someData = {
						meetingInfo:data.meeting,
						meetingAction:'watch'
					}
				}else if(data.action == 'editMeeting'){
					for (var i = this.editableTabs.length - 1; i >= 0; i--) {
						if(this.editableTabs[i].name == 'editMeeting' + data.meeting.meetingId){
							this.editableTabsValue = this.editableTabs[i].name;
					        return;
						}
					}
					tabInfo.title = '编辑会议';
					tabInfo.name = 'editMeeting' + data.meeting.meetingId;
					tabInfo.componentName = 'meeting-info';
					this.editableTabsValue = tabInfo.name;
					tabInfo.someData = {
						meetingInfo:data.meeting,
						meetingAction:'edit',
						componentName:tabInfo.name
					}
				}else if(data.action == 'editTheme'){
					for (var i = this.editableTabs.length - 1; i >= 0; i--) {
						if(this.editableTabs[i].name == 'editTheme' + data.theme.themeId){
							this.editableTabsValue = this.editableTabs[i].name;
					        return;
						}
					}
					tabInfo.title = '编辑主题';
					tabInfo.name = 'editTheme' + data.theme.themeId;
					tabInfo.componentName = 'theme-info';
					this.editableTabsValue = tabInfo.name;
					tabInfo.someData = {
						existThemeobj:data.theme,
						themeAction:'editAlterDirect'
					}
				}
				this.editableTabs.push(tabInfo);
			},
			doDynamicEvent(data){
				if (data.action == 'watchThemeDetail') {
					for (var i = this.editableTabs.length - 1; i >= 0; i--) {
						if(this.editableTabs[i].name == 'themeDetail' + data.theme.themeId){
							this.editableTabsValue = this.editableTabs[i].name;
					        return;
						}
					}
					var tabInfo = {};
					tabInfo.title = '主题:' + data.theme.themeName;
					tabInfo.name = 'themeDetail' + data.theme.themeId;
					tabInfo.componentName = 'theme-info';
					this.editableTabsValue = tabInfo.name;
					tabInfo.someData = {
						existThemeobj:data.theme,
						themeAction:'watch'
					}
					this.editableTabs.push(tabInfo);
				} else if(data.action == 'refreshSearchList'){
					this.$refs['meetingResultList'].refreshData();
					this.$refs['themeResultList'].refreshData();
				} else if(data.action == 'cancleMeeting'){
					for (var i = this.editableTabs.length - 1; i >= 0; i--) {
						if (this.editableTabs[i].name == data.componentName) {
							this.editableTabs.splice(i,1);
							this.editableTabsValue = 'meetingResultList';
						} else {}
						
					}
				}
			},
			tabTitleShow(titleName){
				var zhCharArr = titleName.match(/[^\x00-\x80]/g);
				var notZhCharArr = titleName.length - zhCharArr.length;
				var titleNameRealLength = zhCharArr.length * 2 + notZhCharArr * 1;
				if (titleNameRealLength > 14) {
					var shortTitleName = '';
					var stringLengthCount = 0;
					for (var i = 0; i < titleName.length; i++) {
						if (stringLengthCount > 14) {
							break;
						} else {
							shortTitleName += titleName[i];
							if(zhCharArr.indexOf(titleName[i]) == -1){
								stringLengthCount += 1;
							}else{
								stringLengthCount += 2;
							}
						}
					}
					return shortTitleName + '...';
				} else {
					return titleName;
				}
			}
		},
		mounted:function(){
		}
	}
</script>
<style scoped>
/*.tab-container >>> .el-tabs__header{
	opacity: 0;
	transition: opacity .2s;
}
.tab-container >>> .el-tabs__header:hover{
	opacity: 1;
}*/
</style>