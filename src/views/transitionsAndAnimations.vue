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
      </section>
    </section>
  </div>
</template>

<script>
export default {
}
</script>
