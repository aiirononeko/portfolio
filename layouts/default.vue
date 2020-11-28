<template>
  <div>
    <Nuxt />
  </div>
</template>

<style>
html {
  font-family:
    'Bodoni 72 Smallcaps',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  background-color: #f5f5f5;
}

.container {
  margin: 0 auto;
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-weight: 300;
  font-size: 6rem;
  color: #708090;
  letter-spacing: 5px;
}

.footer {
  min-height: 10vh;
  font-size: 2rem;
  float: right;
  margin: auto 10%;
  color: #708090;
}
</style>
