<template lang="html">
  <div class="content">
    <section id="c-3">
			<h2>Visual Effects</h2>
			<section id="c-3-1">
				<h3>One-sided shadows</h3>
				<section id="eg-3-1-1">
					<h4>Shadow on one side</h4>
					<div></div>
					<code>
						box-shadow: 0 5px 4px -4px black;
					</code>
				</section>
				<section id="eg-3-1-2">
					<h4>Shadow on two adjacent sides</h4>
					<div></div>
					<code>
						box-shadow: 3px 3px 6px -3px black;
					</code>
				</section>
				<section id="eg-3-1-3">
					<h4>Shadow on two opposite sides</h4>
					<div></div>
					<code>
						box-shadow: 5px 0 5px -5px black,-5px 0 5px -5px black;
					</code>
				</section>
			</section>
			<section id="c-3-2">
				<h3>Irregular drop shadows</h3>
				<section id="eg-3-2-1">
					<div class="speech"></div>
					<div class="dot"></div>
					<div class="cutout"></div>
					<code>
						-webkit-filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));<br/>
						filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));
					</code>
				</section>
				<section id="eg-3-2-2">
					<h4>shadow's shadow</h4>
					<div>shadows</div>
					<code>
						text-shadow: .1em .2em yellow;<br/>
						-webkit-filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));<br/>
						filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));
					</code>
				</section>
			</section>
			<section id="c-3-3">
				<h3>Color tinting</h3>
				<section id="eg-3-3-1">
					<h4>Filter-based solution</h4>
					<img src="http://csssecrets.io/images/tiger.jpg" alt="">
					<code>
						filter: sepia() saturate(4) hue-rotate(295deg);<br/>
						-webkit-filter: sepia() saturate(4) hue-rotate(295deg);
					</code>
				</section>
				<section id="eg-3-3-2">
					<h4>Blending mode solution</h4>
					<div></div>
					<code>
						background-color: hsl(335, 100%, 50%);<br/>
						background-blend-mode: luminosity;
					</code>
				</section>
			</section>
			<section id="c-3-4">
				<h3>Frosted glass effect</h3>
				<section id="eg-3-4-1">
					<div class="bg">
						<div>This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.</div>
					</div>
					<code>background-color: rgba(255,255,255,0.5);</code>
				</section>
				<section id="eg-3-4-2">
					<div class="bg">
						<div>This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.</div>
					</div>
					<code>filter: blur(20px);</code>
				</section>
			</section>
			<section id="c-3-5">
				<h3>Folded corner effect</h3>
				<section id="eg-3-5-1">
					<h4>The 45° solution</h4>
					<div></div>
					<code>
						background: #58a; /* Fallback */<br/>
						background:<br/>
						    linear-gradient(to left bottom,<br/>
						        transparent 50%, rgba(0,0,0,.4) 0)<br/>
						        no-repeat 100% 0 / 2em 2em,<br/>
						    linear-gradient(-135deg,<br/>
						        transparent 1.4em, #58a 0);
					</code>
				</section>
				<section id="eg-3-5-2">
					<h4>Solution for other angles</h4>
					<div></div>
					<code>
						background: #58a; /* Fallback */<br/>
						linear-gradient(to left bottom,<br/>
	        transparent 50%, rgba(0,0,0,.4) 0)<br/>
	        no-repeat 100% 0 / 3em 1.73em,<br/>
	    linear-gradient(-150deg,<br/>
	        transparent 1.5em, #58a 0)<br/>
					</code>
				</section>
			</section>
		</section>
  </div>
</template>

<script>
export default {
}
</script>
