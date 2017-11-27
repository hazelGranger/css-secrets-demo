<template lang="html">
  <div class="content">
    <section id="c-5">
      <h2>User Experience 用户体验</h2>
      <section id="c-5-1">
        <h3>Picking the right cursor 选用合适的鼠标光标</h3>
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
      <section id="c-5-2">
        <h3>Extending the clickable area 扩大可点击区域</h3>
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
      <section id="c-5-3">
        <h3>Custom checkboxes 自定义复选框</h3>
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
    </section>
  </div>
</template>

<script>
export default {
}
</script>
