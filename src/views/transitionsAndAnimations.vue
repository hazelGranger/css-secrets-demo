<template lang="html">
  <div class="content">
    <section class="c-7">
      <h2>Transitions &amp; Animations 过渡与动画</h2>
      <section id="c-7-1">
        <h3>Elastic tranistions 缓动效果</h3>
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
      <section id="c-7-2">
        <h3>Frame-by-frame animations 逐帧动画</h3>
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
      <section id="c-7-3">
        <h3>Blinking 闪烁效果</h3>
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
      <section id="c-7-4">
        <h3>Typing animation 打字动画</h3>
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
