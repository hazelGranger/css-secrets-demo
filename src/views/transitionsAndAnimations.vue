<template lang="html">
  <div class="content">
    <section id="c-7" class="c-chapter">
      <h2>{{ $t("lang.directory[6].chapter") }}</h2>
      <section id="c-7-1" class="c-section">
        <h3>{{ $t("lang.directory[6].sections[0]") }}</h3>
        <h4>Bouncing Animations</h4>
        <div id="eg-7-1-1">
          <div class="ball"></div>
        </div>
        <code>
          @keyframes bounce {
            60%, 80%, to {
          		transform: translateY(280px);
          		animation-timing-function: ease;
          	}
          	70% { transform: translateY(210px); }
          	90% { transform: translateY(250px); }
          }
          .ball{
            animation: bounce 1.5s cubic-bezier(.1,.25,1,.25) forwards;
          }
        </code>
        <h4>Elastic tranistions</h4>
        <div id="eg-7-1-2">
          <label>
            <input type="text" value="NoOne">
            <span class="callout">Only letters, numbers, underscores (_) and hyphens (-) allowed!</span>
          </label>
        </div>
        <code>
          input:not(:focus) + .callout:not(:hover){
            transform: scale(0);
            transition: .25s transform;
          }
          .callout{
            transition: .5s cubic-bezier(.25,.1,.3,1.5) transform;
            transform-origin: 1em -.4em;
          }
        }
        </code>
      </section>
      <section id="c-7-2" class="c-section">
        <h3>{{ $t("lang.directory[6].sections[1]") }}</h3>
        <div id="eg-7-2-1">
          <div class="loader"></div>
        </div>
        <code>
          @keyframes loader {
            to {
              background-position: -800px 0;
            }
          }

          .loader{
            animation: loader 1s infinite steps(8);
          }
        </code>
      </section>
      <section id="c-7-3" class="c-section">
        <h3>{{ $t("lang.directory[6].sections[2]") }}</h3>
        <div id="eg-7-3-1">
          <p class="blink-smooth-1">Pokemon!</p>
          <p class="blink-smooth-2">Pokemon!</p>
          <p class="blink">Pokemon!</p>
        </div>
        <code>
          @keyframes blink-1 {
            50% {
              color: transparent;
            };
          }

          @keyframes blink-2 {
            to {
              color: transparent;
            }
          }

          .blink-smooth-1{
            animation: blink-1 1s 3;
          }
          .blink-smooth-2{
            animation: blink-2 .5s 6;
            animation-direction: alternate;
          }
          .blink{
            animation: 1s blink-1 3 steps(1);
          }
        </code>
      </section>
      <section id="c-7-4" class="c-section">
        <h3>{{ $t("lang.directory[6].sections[3]") }}</h3>
        <div id="eg-7-4-1">
          <h1 v-bind:style="typingStyles">{{typingText}}</h1>
        </div>
        <code>
          @keyframes typing {
            from{
              width: 0;
            }
          }

          @keyframes caret {
            50% {
              border-right-color: transparent;
            }
          }

          h1{
            overflow: hidden;
            border-right: .05em solid;
            white-space: nowrap;
            width: 15ch;
            animation: typing 8s steps(15),caret 1s steps(1) infinite;
          }
        </code>
        <p>If use js to calculate the animation params, the effect would be better.</p>
        <p>Since I use vue in the whole project, the js code will not be displayed here! You can find it in the source code!</p>
      </section>
      <section id="c-7-5" class="c-section">
        <h3>{{ $t("lang.directory[6].sections[4]") }}</h3>
        <div id="eg-7-5-1">
        </div>
        <code>
          @keyframes panoramic {
            to {
              background-position: 100% 0;
            }
          }

          #eg-7-5-1{
            background-image: url('http://lea.verou.me/book/panoramic.jpg');
            height: 300px;
            width: 300px;
            background-size: auto 100%;
            animation: panoramic 10s linear infinite alternate;
            animation-play-state: paused;
            &amp;:hover,&amp;:focus{
              animation-play-state: running;
            }
          }
        </code>
      </section>
      <section id="c-7-6" class="c-section">
        <h3>{{ $t("lang.directory[6].sections[5]") }}</h3>
        <h4>Two element solution</h4>
        <div id="eg-7-6-1">
          <div class="path">
            <div class="avatar">
              <img src="http://csssecrets.io/images/adamcatlace.jpg" alt="avatar">
            </div>
          </div>
        </div>
        <code>
          @keyframes spin {
            to{
              transform: rotate(1turn);
            }
          }
          .avatar{
            animation: spin 8s linear infinite;
            transform-origin: 50% 180px;
          }
          .avatar > img{
            animation: inherit;
            animation-direction: reverse;
          }
        </code>
        <h4>Single element solution</h4>
        <div id="eg-7-6-2">
          <div class="path">
            <img class="avatar" src="http://csssecrets.io/images/adamcatlace.jpg" alt="avatar">
          </div>
        </div>
        <code>
          @keyframes spin-2 {
            from {
              transform: rotate(0turn) translateY(-180px) translateY(50%) rotate(1turn);
            }
            to {
              transform: rotate(1turn) translateY(-180px) translateY(50%) rotate(0turn);
            }
          }

          .avatar{
            margin: calc(~"50% - 30px") auto 0;
            animation: spin-2 8s linear infinite;
          }
        </code>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return{
      typingText: 'CSS is awesome!',
      typingStyles: {}
    }
  },
  created() {
    let length = this.typingText.length;
    let styles = {
      width: length + 'ch',
      animationTimingFunction: "steps(" + length +"),steps(1)",
      animationDuration: length/2 + "s, 1s"
    }
    this.typingStyles = styles;
  }
}
</script>
