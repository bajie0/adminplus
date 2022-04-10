// 导入websocket含心跳包 npm install websocket-heartbeat-js / https://github.com/zimv/websocket-heartbeat-js/blob/master/README-zh.md
import WebsocketHeartbeatJs from 'websocket-heartbeat-js';
import { store } from '../store/index.js'
export default {
	data() {
		return {
			websocket: null //WebsocketHeartbeatJs实例化对象
		}
	},
	unmounted(){
		this.websocket.close()
	},
	created() {
		this.websocket = new WebsocketHeartbeatJs({
			url: store.$ws,
			pingTimeout: 15000,
			pongTimeout: 10000,
			reconnectTimeout: 2000,
			pingMsg: "heartbeat"
		});
		this.websocket.onopen = this.websocketonopen
		this.websocket.onmessage = this.websocketonmessage
		this.websocket.onerror = this.websocketonerror
		this.websocket.onclose = this.websocketonclose
	},
	methods: {
		// 监听websocket开启，首次握手成功，只握手一次
		websocketonopen() {
			// 下面代码连接成功后全局只执行一次，类似created
			console.log('websocket连接成功');
			this.websocket.send(JSON.stringify({
				classroom_id: 300,
				hj_state: 1
			}));
		},
		// 监听收到服务器的消息
		websocketonmessage(e) {
			// 处理收到服务器的消息
			console.log('收到服务消息:', JSON.parse(e.data))
		},
		// 监听websocket错误
		websocketonerror() {
			//不需要任何重连机制，心跳包已将重连机制封装好
			console.log('websocket连接发生错误');
		},
		// 监听websocket关闭
		websocketonclose() {
			//不需要任何重连机制，心跳包已将重连机制封装好
			console.log('websocket连接已关闭');
		}
	}
}
