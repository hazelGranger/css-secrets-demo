<template lang="html">
  <div class="content">
    <section id="c-3" class="c-chapter">
			<h2>{{ $t("lang.directory[2].chapter") }}</h2>
			<section id="c-3-1" class="c-section">
				<h3>{{ $t("lang.directory[2].sections[0]") }}</h3>
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
			<section id="c-3-2" class="c-section">
				<h3>{{ $t("lang.directory[2].sections[1]") }}</h3>
				<section id="eg-3-2-1">
					<div class="speech"></div>
					<div class="dot"></div>
					<div class="cutout"></div>
					<code>
						-webkit-filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));
						filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));
					</code>
				</section>
				<section id="eg-3-2-2">
					<h4>shadow's shadow</h4>
					<div>shadows</div>
					<code>
						text-shadow: .1em .2em yellow;
						-webkit-filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));
						filter: drop-shadow(.1em .1em .1em rgba(0,0,0,.5));
					</code>
				</section>
			</section>
			<section id="c-3-3" class="c-section">
				<h3>{{ $t("lang.directory[2].sections[2]") }}</h3>
				<section id="eg-3-3-1">
					<h4>Filter-based solution</h4>
					<img src="http://csssecrets.io/images/tiger.jpg" alt="">
					<code>
						filter: sepia() saturate(4) hue-rotate(295deg);
						-webkit-filter: sepia() saturate(4) hue-rotate(295deg);
					</code>
				</section>
				<section id="eg-3-3-2">
					<h4>Blending mode solution</h4>
					<div></div>
					<code>
						background-color: hsl(335, 100%, 50%);
						background-blend-mode: luminosity;
					</code>
				</section>
			</section>
			<section id="c-3-4" class="c-section">
				<h3>{{ $t("lang.directory[2].sections[3]") }}</h3>
				<section id="eg-3-4-1">
					<div class="bg">
						<div>This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.</div>
					</div>
					<code>
            background-color: rgba(255,255,255,0.5);
          </code>
				</section>
				<section id="eg-3-4-2">
					<div class="bg">
						<div>This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.This is an awesome paragraph.</div>
					</div>
					<code>
            filter: blur(20px);
          </code>
				</section>
			</section>
			<section id="c-3-5" class="c-section">
				<h3>{{ $t("lang.directory[2].sections[4]") }}</h3>
				<section id="eg-3-5-1">
					<h4>The 45° solution</h4>
					<div></div>
					<code>
						background: #58a; /* Fallback */
						background:
						    linear-gradient(to left bottom,
						        transparent 50%, rgba(0,0,0,.4) 0)
						        no-repeat 100% 0 / 2em 2em,
						    linear-gradient(-135deg,
						        transparent 1.4em, #58a 0);
					</code>
				</section>
				<section id="eg-3-5-2">
					<h4>Solution for other angles</h4>
					<div></div>
					<code>
						background: #58a; /* Fallback */
						linear-gradient(to left bottom,
	        transparent 50%, rgba(0,0,0,.4) 0)
	        no-repeat 100% 0 / 3em 1.73em,
	    linear-gradient(-150deg,
	        transparent 1.5em, #58a 0)
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
