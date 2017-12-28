<template>
	<div id='index' @click.native="createCircle" @click="createCircle">
		<h1 class="information">{{information}}</h1>
		<button class="file-button" @click="handle">
			<i class="red-icon red-icon-daohangtubiao"></i>
		</button>
		<input type="file" ref="file" accept="audio/*" @change="decodeData()">
	</div>
</template>

<script>
	export default {
		name: 'index',
		data() {
			return {
				circle: 0,
				timer: '',
				resource: {},
				audioCtx: {},
				playing: false,
				canvas: {},
				interval: 0,
				information:'想要个酷炫的音乐播放器'
			}
		},
		mounted() {
			this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			// this.startWave();
		},
		methods: {
			handle() {
				this.$refs['file'].click();
			},
			caculate(analyser) {
				let context = this.canvas.getContext('2d');
				let gap = 2, lineWidth = 10, cwidth = this.canvas.width, cheight = this.canvas.height;
				let lineNumber = Math.round(this.canvas.width / (gap + lineWidth));
				let step = Math.round(analyser.frequencyBinCount / lineNumber);
				let gradient = context.createLinearGradient(0, 0, 0, cheight);
				gradient.addColorStop(0.5, '#f50a08');
				gradient.addColorStop(0.4, '#f57708');
				gradient.addColorStop(0.6, '#f57708');
				gradient.addColorStop(0.3, '#f5da08');
				gradient.addColorStop(0.7, '#f5da08');
				gradient.addColorStop(0.2, '#f5089f');
				gradient.addColorStop(0.8, '#f5089f');
				gradient.addColorStop(0, '#7b08f5');
				gradient.addColorStop(1, '#7b08f5');
				context.fillStyle = gradient;
				let array = new Uint8Array(analyser.frequencyBinCount);
				this.interval = setInterval(() => {
					analyser.getByteTimeDomainData(array);
					context.clearRect(0, 0, cwidth, cheight);
					for (let i = 0; i < lineNumber; i++) {
						const element = array[i * step];
						context.fillRect(i * (gap + lineWidth),0.5*cheight, lineWidth, -element);
						// context.fillRect(i * (gap + lineWidth),0.5*cheight, lineWidth, element);
					}
				}, 1000 / 60);
			},
			decodeData() {
				if (this.$refs['file'].files.length==0) {
					this.information='please select an audio file'
					return
				}
				if(this.resource.stop){
					this.resource.stop(this.audioCtx.currentTime);
				}
				clearInterval(this.interval);
				let that = this,analyser = this.audioCtx.createAnalyser(),fileReader = new FileReader()
				fileReader.onloadend = function (e) {
					let filedata = e.target.result
					that.audioCtx.decodeAudioData(filedata, function (buffer) {
						that.resource = that.audioCtx.createBufferSource();
						that.resource.buffer = buffer
						that.resource.loop = true
						that.resource.connect(analyser)
						analyser.connect(that.audioCtx.destination)
						that.resource.start(0)
						that.information=that.$refs['file'].files[0].name
						that.playing = true
						that.createCanvas()
						that.caculate(analyser)
					})
				}
				fileReader.readAsArrayBuffer(this.$refs['file'].files[0])
				this.information='正在解码你的音乐'
			},
			createCanvas() {
				if (this.canvas.width) {
					return;
				}
				let width = window.screen.availWidth;
				let height = window.screen.availHeight;
				this.canvas = document.createElement('canvas')
				this.canvas.className = 'waveCanvas';
				this.canvas.width = 0.8*width;
				this.canvas.height = 0.5*height;
				document.getElementById('index').appendChild(this.canvas);
			},
			startWave() {
				this.circle = setInterval(() => {
					this.createWave(Math.random() * (document.documentElement.clientWidth), Math.random() * (document.documentElement.clientWidth));
				}, 1000)
			},
			createCircle(event) {
				this.createWave(event.clientX, event.clientY)
			},
			createWave(x, y) {
				let circle = document.createElement('div');
				circle.style.position = 'fixed';
				circle.style.left = x + 'px';
				circle.style.top = y + 'px';
				circle.className = 'moveCircle';
				circle.addEventListener('click', this.createCircle);
				document.getElementById('index').appendChild(circle);
				let waveTimer = setTimeout(() => {
					circle.removeEventListener('click', this.createCircle);
					if (document.getElementById('index').hasChildNodes(circle)) {
						document.getElementById('index').removeChild(circle);
					}
					clearTimeout(waveTimer);
				}, 2000);
			}
		},
		destroyed() {
			clearInterval(this.circle);
			if (this.canvas.width) {
				document.getElementById('index').removeChild(this.canvas);
			}
		}
	}
</script>

<style lang="scss">
	#index {
		/* background-image: url('../assets/images/bg.jpg'); */
		background-color: rgb(59, 53, 53);
		background-attachment: fixed;
		background-position: center;
		background-size: 100% 100%;
		background-repeat: round;
		overflow: none;
		.information{
			position: absolute;
			top:0;
			text-align:center;
			color:#fff;
			text-indent:20px;
		}
		button {
			z-index: 9999;
		}
		@media screen and (max-width:800px) {
			.waveCanvas {
				position: fixed;
				z-index: 1;
				color: aliceblue;
				margin-left:50%;
				margin-top:50%;
				transform: translateX(-50%)
			}
		}
		@media screen and (min-width:800px) {
			.waveCanvas {
				position: fixed;
				z-index: 1;
				color: aliceblue;
				margin-left:50%;
				margin-top:10%;
				transform: translateX(-50%)
			}
		}
		
		.file-button {
			position: fixed;
			width: 48px;
			color: aliceblue;
			background: rgb(85, 184, 167);
			border: none;
			height: 48px;
			border-radius: 100%;
			cursor: pointer;
			bottom: 20%;
			left: 50%;
			outline: none;
			z-index: 10000;
			text-align: center;
			transform: translateX(-50%);
			i {
				font-size: 22px;
			}
		}

		.file-button:hover {
			color: aliceblue;
			background: rgb(55, 114, 104);
		}
		.moveCircle {
			overflow: none;
			display: inline-block;
			width: 0px;
			height: 0px;
			transition: all 1s;
			border-radius: 100%;
			background-position: 0 0;
			background: transparent;
			border-color: rgb(74, 156, 142);
			border-style: solid;
			border-width: 10px;
			opacity: 0.2;
			z-index: 2;
			animation: biger 2s cubic-bezier(.14, .79, .8, .83);
		}
		input[type="file"] {
			display: none;
		}
		@keyframes biger {
			0% {
				border-width: 10px;
				padding: 1px;
				transform: translateX(-1px) translateY(-1px)
			}
			100% {
				border-width: 1px;
				padding: 99vh;
				transform: translateX(-99vh) translateY(-99vh)
			}
		}
		* {
			user-select: none;
		}
	}
</style>