<template>
	<div id='index' @click.native="createCircle" @click="createCircle">

		<!-- <audio class="index-audio" ref="audio" src="../assets/music/bg-r.flac"></audio> -->


		<!-- <div class="player">
			<button @click="stopMusic()">
				<i class="red-icon" :class="{'red-icon-bofangqibofang':playing,'red-icon-bofangqizanting40':!playing}"></i>
			</button>
		</div> -->
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
				circle: '',
				timer: '',
				bitNumber: 1024,
				resource: {},
				audioCtx: {},
				playing: true,
				canvas: {},
				interval: 0,
			}
		},
		mounted() {
			window.requestAnimationFrame = window.requestAnimationFrame | webkitRequestAnimationFrame
			this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			this.startWave();
		},
		methods: {
			handle() {
				// that.playing
				this.$refs['file'].click();
			},
			caculate(analyser) {
				let context = this.canvas.getContext('2d');
				let gap = 2, lineWidth = 10, cwidth = this.canvas.width, cheight = this.canvas.height;
				let lineNumber = Math.round(this.canvas.width / (gap + lineWidth));
				let step = Math.round(analyser.frequencyBinCount / lineNumber);
				let gradient = context.createLinearGradient(0, 0, 0, cheight);
				gradient.addColorStop(1, '#dbf6f4');
				gradient.addColorStop(0.5, '#25f3e8');
				gradient.addColorStop(0, '#0e625a');
				context.fillStyle = gradient;
				this.bitNumber = analyser.frequencyBinCount;
				let array = new Uint8Array(analyser.frequencyBinCount);
				this.interval = setInterval(() => {
					analyser.getByteTimeDomainData(array);
					context.clearRect(0, 0, cwidth, cheight);
					for (let i = 0; i < lineNumber; i++) {
						const element = array[i * step];
						console.log(element, array);
						context.fillRect(i * (gap + lineWidth), element - this.canvas.height, lineWidth, this.canvas.height);
					}
				}, 1000 / 60);
			},

			decodeData() {
				if (this.$refs['file'].files[0]) {
					return;
				}
				if (that.resource.stop) {
					clearInterval(this.interval);
					that.resource.stop(this.audioCtx.currentTime)
				}
				let that = this
				let analyser = this.audioCtx.createAnalyser()
				let fileReader = new FileReader()
				fileReader.onloadend = function (e) {
					let filedata = e.target.result
					that.audioCtx.decodeAudioData(filedata, function (buffer) {
						that.resource = that.audioCtx.createBufferSource();
						that.resource.buffer = buffer;
						that.resource.connect(analyser);
						analyser.connect(that.audioCtx.destination);
						that.resource.start();
						that.playing = true;
						that.createCanvas();
						that.caculate(analyser)
					})
				}
				fileReader.readAsArrayBuffer(this.$refs['file'].files[0])
			},
			createCanvas() {
				if (this.canvas.width) {
					return;
				}
				let width = window.screen.availWidth;
				let height = window.screen.availHeight;
				this.canvas = document.createElement('canvas')
				this.canvas.className = 'waveCanvas';
				this.canvas.width = width;
				this.canvas.height = height * 0.8;
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
		background-image: url('../assets/images/bg.jpg');
		background-attachment: fixed;
		background-position: center;
		background-size: 100% 100%;
		background-repeat: round;
		overflow: none;
		button {
			z-index: 9999;
		}
		.waveCanvas {
			z-index: 1;
			color: aliceblue;
		}
		.file-button {
			width: 48px;
			color: aliceblue;
			background: rgb(85, 184, 167);
			border: none;
			height: 48px;
			border-radius: 100%;
			cursor: pointer;
			position: fixed;
			bottom: 10%;
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