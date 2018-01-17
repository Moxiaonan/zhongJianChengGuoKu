
var servicePath = 'http://127.0.0.1:8082';
// var servicePath = 'http://192.1.1.234:8186';
// var servicePath = 'http://192.1.1.235:8186';
// var servicePath = 'http://116.10.196.223:8082';
// var servicePath = 'http://116.10.196.223:8186';
// var servicePath = 'http://192.1.1.230:8186';

export default{
	getTableDataUrl:servicePath + '/dahyMeeting/getByKeyword',
	getUuidUrl:servicePath + '/dahyAccessory/getUuid',
	uploadFileUrl:servicePath + '/dahyAccessory/uploadFile',
	getCurrDirFileUrl:servicePath + '/dahyAccessory/getcurrDirFile',
	newFolderUrl:servicePath + '/dahyAccessory/newFolder',
	insertMeetingUrl:servicePath + '/dahyMeeting/insertMeeting',
	editMeetingUrl:servicePath + '/dahyMeeting/editMeeting',
	getMeetingInfoUrl:servicePath + '/dahyMeeting/getMeetingInfo',
	delAccessoryUrl:servicePath + '/dahyAccessory/delAccessory',
	downloadFileUrl:servicePath + '/dahyAccessory/downloadFile',
	insertThemeUrl:servicePath + '/dahyTheme/insertTheme',
	deleteThemeUrl:servicePath + '/dahyTheme/deleteTheme',
	alterThemeUrl:servicePath + '/dahyTheme/alterTheme',
	deleteMeetingUrl:servicePath + '/dahyMeeting/deleteMeeting',
	getThemeDataUrl:servicePath + '/dahyTheme/getThemeData'
}

