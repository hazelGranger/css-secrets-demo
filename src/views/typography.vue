<template lang="html">
  <div class="content">
    <section id="c-4">
      <h2>Typography 字体排印</h2>
      <section id="c-4-1">
        <h3>Hyphenation 连字符断行</h3>
        <p >中文排版环境下一般不需要考虑连字符断行</p>
        <div id="eg-4-1-1">“The only way to get rid of a temptation is to yield to it.”</div>
          <code>
            width: 5em;
            font-size: 18px;
            text-align: justify;
            hyphens: auto;
            height: auto;
          </code>
      </section>
      <section id="c-4-2">
        <h3>Inserting line breaks 插入换行</h3>
        <div id="eg-4-2-1">
          <dl>
            <dt>Name:</dt>
            <dd>Hazel</dd>

            <dt>Email:</dt>
            <dd>css-secrets-demo@gmail.com</dd>

            <dt>Location:</dt>
            <dd>Earth</dd>
          </dl>
        </div>
        <code>dt,dd{
            display: inline;
          }
          dd{
            margin: 0;
            font-weight: bold;
            &ammp;::after{
              content: '\A';
              white-space: pre;
          }
        </code>
        <div id="eg-4-2-2">
          <dl>
            <dt>Name:</dt>
            <dd>Hazel</dd>

            <dt>Email:</dt>
            <dd>css-secrets-demo@gmail.com</dd>
            <dd>css@edu.cn</dd>

            <dt>Location:</dt>
            <dd>Earth</dd>
          </dl>
        </div>
        <code>
          dd + dt::before{
            content: '\A';
            white-space: pre;
          }
          dd + dd::before{
            content: ', ';
            font-weight: normal;
            margin-left: -.25em;
          }
        </code>
      </section>
    </section>
  </div>
</template>

<script>
export default {
}
</script>
