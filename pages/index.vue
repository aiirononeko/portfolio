<template>
  <div>
    <div class="container">
      <h1 class="title">Welcome to my Portfolio!</h1>
    </div>
    <Footer class="footer" />
  </div>
</template>

<script>
import Footer from '@/components/Footer'

export default {
  components: {
    Footer
  }
}
</script>

<style>
.title {
  letter-spacing: 8px;
}
</style>
