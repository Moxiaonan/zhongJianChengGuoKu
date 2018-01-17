// var ftoken = 'eyJleHQiOjE1MDU5MTY2NDExNjgsInVpZCI6InQwMTAxXzJjOTAwMGEwNWFiMjUxMWUwMTVhZGE1Y2YyOGYwNTFhIiwiaWF0IjoxNTA1ODczNDQxMTY4fQ'
var currCookie = document.cookie;
var ftoken = '';
if (document.cookie) {
	ftoken = document.cookie.split('ftoken=')[1].split('.')[1];
} else {
	ftoken = 'eyJleHQiOjE1MDU5MTY2NDExNjgsInVpZCI6InQwMTAxXzJjOTAwMGEwNWFiMjUxMWUwMTVhZGE1Y2YyOGYwNTFhIiwiaWF0IjoxNTA1ODczNDQxMTY4fQ'
}
export default{
	ftoken
}