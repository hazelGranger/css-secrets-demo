<template lang="html">
  <div class="content">
    <section id="c-5" class="c-chapter">
      <h2>{{ $t("lang.directory[4].chapter") }}</h2>
      <section id="c-5-1" class="c-section">
        <h3>{{ $t("lang.directory[4].sections[0]") }}</h3>
        <div id="eg-5-1-1">
          <button >Button</button>
          <button disabled>Disabled Button</button>
        </div>
        <code>
          :disabled, [disabled], [aria-disabled="true"]{
            cursor: not-allowed;
          }
        </code>
      </section>
      <section id="c-5-2" class="c-section">
        <h3>{{ $t("lang.directory[4].sections[1]") }}</h3>
        <div id="eg-5-2-1">
          <h4>Border solution</h4>
          <button class="border">+</button><br/>
          <code>
            button{
              background: #58a;
              color: #fff;
              cursor: pointer;
              border-radius: 50%;
              padding: .3em .5em;
              font: 150% bold;
              line-height: 1;
              border: 10px solid transparent;
              background-clip: padding-box;
              box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3) inset;
            }
          </code>
          <h4>Pseudo-elements solution</h4>
          <button class="pseudo">+</button><br/>
          <code>
            button{
              position: relative;
              background: #58a;
              color: #fff;
              cursor: pointer;
              border-radius: 50%;
              padding: .3em .5em;
              font: 150% bold;
              line-height: 1;
              border: 10px solid transparent;
              background-clip: padding-box;
              box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3) inset;
            }
            button::before{
              position: absolute;
              content: '';
              top: -10px;
              right: -10px;
              bottom: -10px;
              left: -10px;
            }
          </code>
        </div>
      </section>
      <section id="c-5-3" class="c-section">
        <h3>{{ $t("lang.directory[4].sections[2]") }}</h3>
        <h4>checkboxes</h4>
        <div id="eg-5-3-1">
          <input type="checkbox" id="checkbox1">
          <label for="checkbox1">option 1</label><br>
          <input type="checkbox" id="checkbox2" checked>
          <label for="checkbox2">option 2</label><br>
          <input type="checkbox" id="checkbox3" disabled>
          <label for="checkbox3">option 3</label><br>
          <input type="checkbox" id="checkbox4" checked disabled>
          <label for="checkbox4">option 4</label><br>
        </div>
        <code>
          input[type="checkbox"] {
          	position: absolute;
          	clip: rect(0,0,0,0);
          }

          input[type="checkbox"] + label::before {
          	content: '\a0';
          	display: inline-block;
          	vertical-align: .2em;
          	width: .8em;
          	height: .8em;
          	margin-right: .2em;
          	border-radius: .2em;
          	background: silver;
          	text-indent: .15em;
          	line-height: .65;
          }

          input[type="checkbox"]:checked + label::before {
          	content: '\2713';
          	background: yellowgreen;
          }

          input[type="checkbox"]:focus + label::before {
          	box-shadow: 0 0 .1em .1em #58a;
          }

          input[type="checkbox"]:disabled + label::before {
          	background: gray;
          	box-shadow: none;
          	color: #555;
          	cursor: not-allowed;
          }
        </code>
        <h4>Toggle buttons</h4>
        <div id="eg-5-3-2">
          <input type="checkbox" id="btn1">
          <label for="btn1">Button 1</label>
          <input type="checkbox" id="btn2">
          <label for="btn2">Button 2</label>
          <code>
            input[type="checkbox"]{
              position: absolute;
              clip: rect(0,0,0,0);
            }

            input[type="checkbox"]&amp; + label{
              display: inline-block;
              padding: .3em .5em;
              background: yellowgreen;
              background-image: linear-gradient(yellowgreen, #6fa600);
              border-radius: 10px;
              border: 1px solid #6fa600;
              box-shadow: 0 1px white inset;
              text-align: center;
              text-shadow: 0 1px 1px white;
              cursor: pointer;
              transition: all .3s ease-in-out;
            }

            input[type="checkbox"]&amp;:checked + label{
              box-shadow: 0 0 .2em .2em rgba(6, 114, 0, 0.6) inset;
              background: #6fa600;
              border: 1px solid rgba(0,0,0,.3);
            }
          </code>
        </div>
      </section>
      <section id="c-5-4" class="c-section">
        <h3>{{ $t("lang.directory[4].sections[3]") }}</h3>
        <h4>box-shadow solution</h4>
        <div id="eg-5-4-1">
          <button v-on:click="showLightbox">Show Modal</button>
          <div class="lightbox" v-if="lightboxShow">
            <span class="close-btn" title="关闭" v-on:click="hideLightBox">X</span>
            <img src="../img/pokemon.jpg" alt="pokemon-img">
          </div>
          <code>
            box-shadow: 0 0 0 50vmax rgba(0,0,0,.8);</code>
          <p>注意由于此方法用 box-shadow 来做黑色阴影，所以无法捕获到鼠标焦点，
            鼠标仍可以操作后层的元素;这个方法比较适合做原型等简易场景时使用</p>
        </div>
        <h4>backdrop solution</h4>
        <p>这种方法需要使用浏览器自带的 showModal() 方法，但是支持的浏览器有限，<br>
          并且需要直接操作DOM元素，在此不做展示</p>
      </section>
      <section id="c-5-5" class="c-section">
        <h3>{{ $t("lang.directory[4].sections[4]") }}</h3>
        <router-link :to="{ path: 'blurDialog' }" target ="_blank">查看示例</router-link>
      </section>
      <section id="c-5-6" class="c-section">
        <h3>{{ $t("lang.directory[4].sections[5]") }}</h3>
        <div id="eg-5-6-1">
          <ul class="list">
            <li>Ada Catlace</li>
            <li>Alan Purring</li>
            <li>Schrödingcat</li>
            <li>Tim Purrners-Lee</li>
            <li>Webkitty</li>
            <li>Json</li>
            <li>Void</li>
            <li>Neko</li>
            <li>NaN</li>
            <li>Cat5</li>
            <li>Vector</li>
          </ul>
        </div>
        <code>
          display: inline-block;
          overflow: auto;
          width: 12em;
          height: 8em;
          border: 1px solid silver;
          padding: .3em .5em;
          list-style: none;
          font-size: 200%;
          background: linear-gradient(#fff 15px,hsla(0,0%,100%,0)) 0 0,
                      radial-gradient(at center top,rgba(0,0,0,0.2),transparent 70%) 0 0,
                      linear-gradient(to top,white 15px,hsla(0,0%,100%,0)) bottom,
                      radial-gradient(at center bottom, rgba(0,0,0,0.2),transparent 70%) bottom;
          background-size: 100% 15px,100% 15px,100% 15px,100% 15px;
          background-repeat: no-repeat;
          background-attachment: local,scroll,local,scroll;
          margin-top: 30px;
        </code>
      </section>
      <section id="c-5-7" class="c-section">
        <h3>{{ $t("lang.directory[4].sections[6]") }}</h3>
        <h4>CSS resize solution</h4>
        <div id="eg-5-7-1">
          <div class="img-slider">
            <div class="slider">
              <img src="http://csssecrets.io/images/adamcatlace-before.jpg" alt="after">
            </div>
            <img src="http://csssecrets.io/images/adamcatlace.jpg" alt="now" class="img">
          </div>
        </div>
        <code>
          .image-slider {
          	position:relative;
          	display: inline-block;
          }

          .image-slider > .slider {
          	position: absolute;
          	top: 0; bottom: 0; left: 0;
          	width: 50%;
          	max-width: 100%;
          	overflow: hidden;
          	resize: horizontal;
          }

          .image-slider > .slider:before {
          	content: '';
          	position: absolute;
          	right: 0; bottom: 0;
          	width: 12px; height: 12px;
          	padding: 5px;
          	background: linear-gradient(-45deg, white 50%, transparent 0);
          	background-clip: content-box;
          	cursor: ew-resize;
          	-webkit-filter: drop-shadow(0 0 2px black);
          	filter: drop-shadow(0 0 2px black);
          }

          .image-slider img {
          	display: block;
          	user-select: none;
          }
        </code>
        <h4>Range input solution</h4>
        <div id="eg-5-7-2">
          <div class="img-slider">
            <div class="slider" v-bind:style="{ width: imgSliderRange +'%'}">
              <img src="http://csssecrets.io/images/adamcatlace-before.jpg" alt="after">
            </div>
            <img src="http://csssecrets.io/images/adamcatlace.jpg" alt="now" class="img">
            <input type="range" class="range" v-model="imgSliderRange">
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return{
      lightboxShow: false,
      blurDialogShow: false,
      imgSliderRange: 50
    }
  },
  methods: {
    showLightbox() {
      this.lightboxShow = true;
    },
    hideLightBox() {
      this.lightboxShow = false;
    }
  }
}
</script>
