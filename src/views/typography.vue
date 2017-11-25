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
        <code>
          dt,dd{
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
      <section id="c-4-3">
        <h3>Zebra-striped text lines 文本行的斑马条纹</h3>
        <p>条纹会随着字体的大小改变而自适应地变化，注意background-size 第二个参数是行高的 2倍</p>
        <div id="eg-4-3-1">
          <pre>
            <code class="code">while (true) {
  var d = new Date();
  if (d.getDate()==1 &&
      d.getMonth()==3) {
    alert("TROLOLOL");
  }
}</code></pre>
            <code>
              font-size: 20px;
              padding: 0.5em;
              line-height: 1.5;
              background: beige;
              background-size: auto 3em;
              background-image: linear-gradient(rgba(0, 0, 0, 0.2) 50%, transparent 0);
              background-origin: content-box;
              white-space: pre;
            </code>
        </div>
      </section>
      <section id="c-4-4">
        <h3>Adjusting tab width 调整 Tab 的宽度</h3>
        <div id="eg-4-4-1">
          <pre class="pre-2">
            <code class="code">while (true) {
	var d = new Date();
	if (d.getDate()==1 &&
	    d.getMonth()==3) {
		alert("TROLOLOL");
	}
}</code>
          </pre>
          <code>
            tab-size: 2;
          </code>
          <pre class="pre-4">
            <code class="code">while (true) {
	var d = new Date();
	if (d.getDate()==1 &&
	    d.getMonth()==3) {
		alert("TROLOLOL");
	}
}</code>
          </pre>
          <code>
            tab-size: 4;
          </code>
        </div>
      </section>
      <section id="c-4-5">
        <h3>Ligatures 连字</h3>
        <div id="eg-4-5-1">
          <p>Common ligatures: fi ff fl ffi ffl</p>
          <p>Discretionary ligatures: st ct</p>
        </div>
        <code>
          font: 150%/1.6 "Adobe Caslon Pro", Baskerville, serif;
          font-variant: common-ligatures discretionary-ligatures historical-ligatures;
        </code>
      </section>
      <section id="c-4-6">
        <h3>Fancy ampersands 华丽的 &amp; 符号</h3>
        <div id="eg-4-6-1">
          <p>HTML &amp; CSS</p>
        </div>
        <code>
          font-family: Ampersand;
          src: local('Baskerville-Italic'),
               local('GoudyOldStyleT-Italic'),
               local('Palatino-Italic'),
               local('BookAntiqua-Italic');
          unicode-range: U+26;

          p{
            font-family: Ampersand, Helvetica, sans-serif;
          }
        </code>
        <p >unicode-range不是css属性，但是它能告诉浏览器，只把字体应用在某个编码范围内；<br/>
          如果需要下载远程的字体文件，有的浏览器甚至只会下载会运用的那一部分；<br/>
          26是 <code class="inline">"&amp;".charCodeAt(0).toString(16);</code> 这么来的；<br/>
          local() 里需要加 Italic，而不能用 font-style，因为只希望运用在符号上。
        </p>
      </section>
      <section id="c-4-7">
        <h3>Custom underlines 自定义下划线</h3>
        <div id="eg-4-7-1">
          <h4>Normal underlines 横线</h4>
          <p class="normal">“The only way to <a>get rid of a temp­ta­tion</a> is to <a>yield</a> to it."</p>
          <code>
            background: linear-gradient(gray, gray) no-repeat;
            background-size: 100% 1px;
            background-position: 0 1.05em;
            text-shadow: .05em 0 white, -.05em 0 white;
          </code>
          <h4>Dashed underlines 虚线</h4>
          <p class="dashed">“The only way to <a>get rid of a temp­ta­tion</a> is to <a>yield</a> to it."</p>
          <code>
            background: linear-gradient(90deg,gray 66%, transparent 0) repeat-x;
            background-size: .2em 2px;
            background-position: 0 1.05em;
            text-shadow: .05em 0 white, -.05em 0 white;
          </code>
          <h4>Wavy underlines 波浪线</h4>
          <p class="wavy">“The only way to <a>get rid of a temp­ta­tion</a> is to <a>yield</a> to it."</p>
          <code>
            background: linear-gradient(90deg,gray 66%, transparent 0) repeat-x;
            background-size: .2em 2px;
            background-position: 0 1.05em;
            text-shadow: .05em 0 white, -.05em 0 white;
          </code>
        </div>
      </section>
      <section id="c-4-8">
        <h3>Realistic text effects 现实中的文字效果</h3>
        <div id="eg-4-8-1">
          <h4>Letterpress</h4>
          <p class="letterpress-1">CSS Secrets Demos</p>
          <code>
            background: hsl(210, 13%, 60%);
            color: hsl(210, 13%, 30%);
            text-shadow: 0 1px 1px hsla(0,0%,100%,.8);
          </code>
          <p class="letterpress-2">CSS Secrets Demos</p>
          <code>
            background: hsl(210, 13%, 30%);
            color: hsl(210, 13%, 60%);
            text-shadow: 0 -1px 1px black;
          </code>
          <h4>Stroked text</h4>
          <p class="strokeText">
            <svg width="2em" height="1.2em">
              <use xlink:href="#css"/>
              <text id="css" y="1em">css</text>
            </svg>
          </p>
          <code>
            .strokeText{
              font: 500%/1 Rockwell, serif;
              background: deeppink;
              color: white;
              text{
                fill: currentColor;
              }
              use{
                stroke: black;
          	    stroke-width: 6;
          	    stroke-linejoin: round;
              }
            }
          </code>
          <h4>Glowing text</h4>
          <p class="glowingText">
            Hover to glow
          </p>
          <code>
            .glowingText{
              background: #203;
              font: bold;
              color: #ffc;
              text-decoration: none;
              transition: 1s;
              &amp;:hover{
                text-shadow: 0 0 .1em,0 0 .3em;
              }
            }
          </code>
          <h4>Extruded text</h4>
          <p class="extrudedText">
            CSS 3D
          </p>
          <code>
            background: #58a;
            color: #fff;
            text-shadow: 0 1px hsl(0,0%,85%),
                         0 2px hsl(0, 0%,80%),
                         0 3px hsl(0,0%,75%),
                         0 4px hsl(0,0%,70%),
                         0 5px hsl(0,0%,65%),
                         0 5px 10px black;
            font: bold 400%/1 Rockwell,serif;
          </code>
        </div>
      </section>
      <section id="c-4-9">
        <h3>Circular text 环形文字</h3>
        <div id="eg-4-9-1">
          <div class="circle">
            <svg viewBox="0 0 100 100">
              <path d="M0,50 a50,50 0 1,1 0,1z" id="circle"></path>
              <text>
                <textPath xlink:href="#circle">
                  Welcome to the World of CSS :)
                </textPath>
              </text>
            </svg>
          </div>
          <code>
            .circle{
              width: 10em;
              height: 10em;
              margin: 4em auto 0;
              font: bold 120% Helvetica, sans-serif;
            }

            .circle svg{
              display: block;
        	    overflow: visible;
        	    transition: 10s linear transform;
              &amp;:hover{
                transform: rotate(-2turn);
              }
            }

            .circle text{
              fill: black;
            }
            .circle path{
              fill: none;
            }

          </code>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
export default {
}
</script>
