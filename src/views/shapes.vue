<template lang="html">
  <div class="content">
    <section id="c-2" class="c-chapter">
			<h2>Shapes 形状</h2>
			<section id="c-2-1" class="c-section">
				<h3>Flexible ellipses</h3>
				<div id="eg-2-1-1"></div>
				<code>
					background-color: #FFDD00;
					border-radius: 50px / 10px;
					border-radius: 50% / 50%;
				</code>
				<div id="eg-2-1-2"></div>
				<code>
					border-radius: 100% 0 0 100% / 50%;
				</code>
				<div id="eg-2-1-3"></div>
				<code>
					border-radius: 100% 0 0 0 ;
				</code>
			</section>
			<section id="c-2-2" class="c-section">
				<h3>Parallelograms</h3>
				<h4>Nested elements solution</h4>
				<div id="eg-2-2-1">
          <div class="ele-wrapper">
            <a href="#yolo" class="button">
  						<div>Click me</div>
  					</a>
          </div>
					<code>
						.button{
							transform: skewX(-45deg);
							display: inline-block;
							background: #0066aa;
							text-decoration: none;
						}

						.button > div{
							transform: skewX(45deg);
						}
					</code>
				</div>
				<h4>Pseudo-element solution</h4>
				<div id="eg-2-2-2">
          <div class="ele-wrapper">
            <a href="#yolo" class="button">
  						Click me
  					</a>
          </div>
					<code>
						.button {
						position: relative;
						}
						.button::before {
						content: '';
						position: absolute;
						top: 0; right: 0; bottom: 0; left: 0;
						z-index: -1;
						background: #58a;
						transform: skew(45deg);
						}
					</code>
				</div>
				<p><a href="https://www.oneasp.com/" target="_blink">点击查看我的应用案例</a></p>
			</section>
			<section id="c-2-3" class="c-section">
				<h3>Diamond images</h3>
				<section>
					<h4>transform-based solution</h4>
					<div id="eg-2-3-1">
						<img src="../img/pokemon.jpg">
					</div>
					<code>
						width: 180px;
						transform: rotate(45deg);
						overflow: hidden;
					</code>
				</section>
				<section>
					<h4>Clipping path solution</h4>
					<div id="eg-2-3-2">
						<img src="../img/pokemon.jpg">
					</div>
					<code>
						-webkit-clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
						clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
					</code>
				</section>
			</section>
			<section id="c-2-4" class="c-section">
				<h3>Cutout corners</h3>
				<section>
					<div id="eg-2-4-1">
					</div>
					<code>
						background: #58a;
						background: linear-gradient(-45deg, transparent 15px, #58a 0);
					</code>
				</section>
				<section>
					<div id="eg-2-4-2"></div>
					<code>
						background: #58a;
						background:
						linear-gradient(-45deg, transparent 15px, #58a 0)
						right,
						linear-gradient(45deg, transparent 15px, #655 0)
						left;
						background-size: 50% 100%;
					</code>
				</section>
				<section>
					<div id="eg-2-4-3"></div>
					<code>
						background: #58a;
						background:
						linear-gradient(-45deg, transparent 15px, #58a 0)
						right,
						linear-gradient(45deg, transparent 15px, #655 0)
						left;
						background-size: 50% 100%;
						background-repeat: no-repeat;
					</code>
				</section>
				<section>
					<div id="eg-2-4-4"></div>
					<code>
						background: #58a;
						background:
						linear-gradient(135deg, transparent 15px, #58a 0)
						top left,
						linear-gradient(-135deg, transparent 15px, #655 0)
						top right,
						linear-gradient(-45deg, transparent 15px, #58a 0)
						bottom right,
						linear-gradient(45deg, transparent 15px, #655 0)
						bottom left;
						background-size: 50% 50%;
						background-repeat: no-repeat;
					</code>
				</section>
				<section>
					<div id="eg-2-4-5"></div>
					<code>
						background: #58a;
						background:
						radial-gradient(circle at top left,
						transparent 15px, #58a 0) top left,
						radial-gradient(circle at top right,
						transparent 15px, #58a 0) top right,
						radial-gradient(circle at bottom right,
						transparent 15px, #58a 0) bottom right,
						radial-gradient(circle at bottom left,
						transparent 15px, #58a 0) bottom left;
						background-size: 50% 50%;
						background-repeat: no-repeat;
					</code>
				</section>
				<section>
					<div id="eg-2-4-6"></div>
					<code>
						background: #58a;
						-webkit-clip-path: polygon(
						20px 0, calc(100% - 20px) 0, 100% 20px,
						100% calc(100% - 20px), calc(100% - 20px) 100%,
						20px 100%, 0 calc(100% - 20px), 0 20px
						);
						clip-path: polygon(
						20px 0, calc(100% - 20px) 0, 100% 20px,
						100% calc(100% - 20px), calc(100% - 20px) 100%,
						20px 100%, 0 calc(100% - 20px), 0 20px
						);
					</code>
				</section>
			</section>
			<section id="c-2-5" class="c-section">
				<h3>Trapezoid tabs</h3>
				<section>
					<div id="eg-2-5-1"></div>
					<code>
						transform: perspective(5em) rotateX(5deg);
						background: #58a;
					</code>
				</section>
				<section>
					<div id="eg-2-5-2">
						<div class="tab"></div>
					</div>
					<code>
						.tab{
							position: relative;
							display: inline-block;
							padding: .5em 1em .35em;
							color: white;
						}

						.tab:before{
							content: '';
							position: absolute;
							top: 0; right: 0; bottom: 0; left: 0;
							z-index: -1;
							background: #58a;
							transform: scaleY(1.3) perspective(.5em) rotateX(5deg);
							transform-origin: bottom;
						}
					</code>
				</section>
				<section>
					<div id="eg-2-5-3">
						<nav>
							<a>home</a>
							<a>A</a>
							<a>B</a>
						</nav>
						<div style="background: #eee;width: 240px;"></div>
					</div>
					<code>
						nav > a{
							position: relative;
							display: inline-block;
							padding: .3em 1em 0;
							cursor: pointer;
						}

						nav > a:before{
							content: '';
							position: absolute;
							top: 0; right: 0; bottom: 0; left: 0;
							z-index: -1;
							background: #ccc;
							background-image: linear-gradient(
							hsla(0,0%,100%,.6),
							hsla(0,0%,100%,0));
							border: 1px solid rgba(0,0,0,.4);
							border-bottom: none;
							border-radius: .5em .5em 0 0;
							box-shadow: 0 .15em white inset;
							transform: perspective(.5em) rotateX(5deg);
							transform-origin: bottom;
						}
					</code>
				</section>
			</section>
			<section id="c-2-6" class="c-section">
				<h3>Simple pie charts</h3>
				<section>
					<h4>div solution</h4>
					<div id="eg-2-6-1">
						<div class="pie"></div>
					</div>
				</section>
				<section>
					<h4>svg solution</h4>
					<div id="eg-2-6-2">
						<div class="pie">
							<svg viewBox="0 0 32 32">
								<title>20%</title>
								<circle r="16" cx="16" cy="16" stroke-dasharray="20 100"></circle>
							</svg>
							<svg viewBox="0 0 32 32">
								<circle r="16" cx="16" cy="16" stroke-dasharray="60 100"></circle>
							</svg>
							<svg viewBox="0 0 32 32">
								<circle r="16" cx="16" cy="16" stroke-dasharray="0 100" class="grow"></circle>
							</svg>
						</div>
					</div>
				</section>
			</section>
		</section>
  </div>
</template>

<script>
export default {
}
</script>
