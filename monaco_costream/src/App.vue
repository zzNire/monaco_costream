<template>
  <div>
    <monaco></monaco>
  </div>
</template>

<script>

import monaco from './components/monaco'

export default {
  name: 'app',
  components:{
    monaco,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
