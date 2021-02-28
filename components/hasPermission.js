// 控制按钮权限
const hasPermission = function(permission) {
	const operationAuthority = uni.getStorageSync('operationAuthority')
	const routerLists = JSON.parse(operationAuthority)
	if (routerLists.length === 0) {
		return true
	} else {
		return routerLists.indexOf(permission) > -1
	}
}
export default hasPermission
