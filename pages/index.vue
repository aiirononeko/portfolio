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
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #708090;
  letter-spacing: 5px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
