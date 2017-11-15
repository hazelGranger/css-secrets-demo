<template >
  <div class="content">
    <h1>Css Secrets Demos</h1>
    <div class="cover">
      <img src="https://cloud.githubusercontent.com/assets/1231359/14773652/5bf7c006-0adf-11e6-8712-70be89b3b97d.jpg"
      alt="[CSS Secrets 简体中文版 - 封面]" class="cover-img">
    </div>
    <p>《CSS Secrets》一书中各章节的 demo</p>
    <p>
      <a v-bind:href="viewLink" class="btn">View on GitHub</a>
      <a v-bind:href="downloadZip" class="btn">Download .zip</a>
      <a v-bind:href="downloadTar" class="btn">Download .tar.gz</a>
    </p>
  </div>
</template>
<script>

export default {
  data () {
    return {
      viewLink: 'https://github.com/hazelGranger/css-secrets-demo',
      downloadZip: 'https://github.com/hazelGranger/css-secrets-demo/zipball/master',
      downloadTar: 'https://github.com/hazelGranger/css-secrets-demo/tarball/master'
    }
  }
}
</script>

<style lang="less">
  .cover{
    overflow: hidden;
    position: relative;
    .cover-img{
      position: relative;
      left: -100px;
      width: 100%;
      max-width: 600px;
    }
  }
</style>
