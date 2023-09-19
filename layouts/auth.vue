<template>
  <div>
    <slot/>
  </div>
</template>

<script>
export default {


  mounted() {
    let userData = JSON.parse(localStorage.getItem('userData')) || {}
    if (!userData.id) {
      this.$router.push({ path: '/' })
      ShowSnack('User not authenticated', 'negaitve')
    }
  }
}
</script>

<style>

</style>