import { store } from '../store/index.js'
export default {
	created(el,bindings){
		//所有权限
		const permissions = store.state.$permissions
		//需要的权限
		const needPermission = bindings.value
		const hasPermission = permissions.includes(needPermission)
		if(!hasPermission){
			el.style.display = 'none'
			setTimeout(()=>{
				el.parentNode.removeChild(el)
			},0)
		}
	}
}