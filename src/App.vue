<template>
    <div id='app'>
        <transition>
            <router-view class="content"></router-view>
		</transition>
    </div>
</template>

<script>


export default {
	name: 'app',
	
}

</script>
<style>
.content{
    position: absolute;
    width:100%;
    height:100%;
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
}
</style>