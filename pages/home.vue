<template>
  <div>
    <div class="background">
      <div class="title_container"> 
        <h1 class="title">Ryota Katada</h1>
        <h3 class="subtitle">Web Engineer & Web Designer</h3>
        <div class="links_box">
          <h4 class="links" @click="goHome">Home</h4>
          <h4 class="links" @click="goAbout">About Me</h4>
          <h4 class="links" @click="goWorks">Works</h4>
          <h4 class="links" @click="goGallery">Photo Gallery</h4>
          <h4 class="links" @click="goContact">Contact</h4>
        </div>
      </div>
      <Footer class="footer" />
    </div>
  </div>
</template>

<script>
import Footer from '@/components/Footer'

export default {
  components: {
    Footer
  },
  methods: {
    goHome() {
      this.$router.push('home')
    },
    goAbout() {
      this.$router.push('about')
    },
    goWorks() {
      this.$router.push('works')
    },
    goGallery() {
      this.$router.push('gallery')
    },
    goContact() {
      this.$router.push('contact')
    }
  }
}
</script>

<style>
.background {
  height: 100vh;
  background-image: url("../assets/DSCF2921.jpg");
  background-size: cover;
}

.title_container {
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 10%;
}

.title {
  color: black;
  margin-top: 8%;
  font-weight: 500;
}

.subtitle {
  font-weight: 300;
  font-size: 2.2rem;
  color: black;
  letter-spacing: 5px;
}

.links_box {
  margin-top: 3%;
  padding-right: 10%;
}

.links {
  font-weight: 500;
  font-size: 2rem;
  margin-top: 5%;
  letter-spacing: 5px;
}
</style>
