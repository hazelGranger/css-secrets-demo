<template lang="html">
  <div class="content">
    <section id="c-1" class="c-chapter">
      <h2>{{ $t("lang.directory[0].chapter") }}</h2>
      <section id="c-1-1" class="c-section">
        <h3>{{ $t("lang.directory[0].sections[0]") }}</h3>
        <div id="eg-1-1">
          <div id="eg-1-1-1">
            semitransparent borders
            semitransparent borders
          </div>
        </div>
        <code>
          border: 10px solid rgba(0, 0, 0, 0.3);
          background: white;
          background-clip: padding-box;
        </code>
      </section>
      <section id="c-1-2" class="c-section">
        <h3>{{ $t("lang.directory[0].sections[1]") }}</h3>
        <h4>box-shadow solution</h4>
        <div id="eg-1-2-1"></div>
        <code>
          background: yellowgreen;
          box-shadow: 0 0 0 10px #655,
          0 0 0 15px deeppink,
          0 2px 5px 15px rgba(0,0,0,.6);
        </code>
        <h4>outline solution</h4>
        <div id="eg-1-2-2"></div>
        <code>
          background: yellowgreen;
          border: 10px solid #655;
          outline: 15px solid deeppink;
        </code>
      </section>
      <section id="c-1-3" class="c-section">
        <h3>{{ $t("lang.directory[0].sections[2]") }}</h3>
        <h4>Extended background-position solution</h4>
        <div id="eg-1-3-1"></div>
        <code>
          background: url(img/water.svg) no-repeat bottom right #CEE2EF;
          background-position: right 20px bottom 10px;
        </code>
        <h4>background-origin solution</h4>
        <div id="eg-1-3-2"></div>
        <code>
          padding: 20px;
          background: url("img/water.svg") no-repeat #CEE2EF
          bottom right; /* or 100% 100% */
          background-origin: content-box;
        </code>
        <h4>calc() solution</h4>
        <div id="eg-1-3-3"></div>
        <code>
          background: url("img/water.svg") no-repeat #CEE2EF;
          background-position: calc(100% - 20px) calc(100% - 20px);
        </code>
      </section>
      <section id="c-1-4" class="c-section">
        <h3>{{ $t("lang.directory[0].sections[3]") }}</h3>
        <div id="eg-1-4-1"></div>
        <code>
          background: tan;
          border-radius: .8em;
          padding: 1em;
          box-shadow: 0 0 0 .6em #655;
          outline: .65em solid #655;
        </code>
      </section>
      <section id="c-1-5" class="c-section">
        <h3>{{ $t("lang.directory[0].sections[4]") }}</h3>
        <section>
          <div id="eg-1-5-1"></div>
          <code>
            background: linear-gradient(#fb3, #58a);
            background: linear-gradient(#fb3 0%, #58a 100%);
          </code>
        </section>
        <section>
          <div id="eg-1-5-2"></div>
          <code>
            background: linear-gradient(#fb3 20%, #58a 80%);
          </code>
        </section>
        <section>
          <div id="eg-1-5-3"></div>
          <code>
            background: linear-gradient(#fb3 40%, #58a 60%);
          </code>
        </section>
        <section>
          <div id="eg-1-5-4"></div>
          <code>
            background: linear-gradient(#fb3 50%, #58a 50%);
          </code>
        </section>
        <section>
          <div id="eg-1-5-5"></div>
          <code>
            background: linear-gradient(#fb3 30%, #58a 0);
            background-size: 100% 30px;
          </code>
        </section>
        <section>
          <div id="eg-1-5-6"></div>
          <code>
            background: linear-gradient(#fb3 33.3%,#58a 0, #58a 66.6%, yellowgreen 0);
            background-size: 100% 45px;
          </code>
        </section>
        <section>
          <div id="eg-1-5-7"></div>
          <code>
            background: linear-gradient(to right,#fb3 50%, #58a 0);
            background: linear-gradient(90deg,#fb3 50%, #58a 0);
            background-size: 30px 100%;
          </code>
        </section>
        <section>
          <div id="eg-1-5-8"></div>
          <code>
            background: linear-gradient(45deg,#fb3 50%, #58a 0);
            background-size: 30px 30px;
          </code>
        </section>
        <section>
          <div id="eg-1-5-9"></div>
          <code>
            background: linear-gradient(45deg,#fb3 25%, #58a 0, #58a 50%,#fb3 0, #fb3 75%, #58a 0);
            background-size: 30px 30px;
          </code>
        </section>
        <section>
          <div id="eg-1-5-10"></div>
          <code>
            background: repeating-linear-gradient(45deg,#fb3, #58a 30px);
          </code>
        </section>
        <section>
          <div id="eg-1-5-11"></div>
          <code>
            background: repeating-linear-gradient(60deg,#fb3, #fb3 15px, #58a 0, #58a 30px);
          </code>
        </section>
        <section>
          <div id="eg-1-5-12"></div>
          <code>
            background: #58a;
            background-image: repeating-linear-gradient(30deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,.1) 15px,transparent 0, transparent 30px);
          </code>
        </section>
      </section>
      <section id="c-1-6" class="c-section">
        <h3>{{ $t("lang.directory[0].sections[5]") }}</h3>
        <section>
          <div id="eg-1-6-1"></div>
          <code>
            background: white;
            background-image: linear-gradient(90deg,rgba(200,0,0,.5) 50%, transparent 0),linear-gradient(rgba(200,0,0,.5) 50%, transparent 0);
            background-size: 31px 30px;
          </code>
        </section>
        <section>
          <div id="eg-1-6-2"></div>
          <code>
            background: white;
            background-image: linear-gradient(90deg,rgba(200,0,0,.5) 50%, transparent 0),linear-gradient(rgba(200,0,0,.5) 50%, transparent 0);
            background-size: 31px 30px;
          </code>
        </section>
        <section>
          <div id="eg-1-6-3"></div>
          <code>
            background: #58a;
            background-image:linear-gradient(white 2px, transparent 0),
            linear-gradient(90deg, white 2px, transparent 0),
            linear-gradient(hsla(0,0%,100%,.3) 1px,transparent 0),
            linear-gradient(90deg, hsla(0,0%,100%,.3) 1px,transparent 0);
            background-size: 75px 75px, 75px 75px,15px 15px, 15px 15px;
          </code>
        </section>
        <section>
          <div id="eg-1-6-4"></div>
          <code>
            background: #655;
            background-image: radial-gradient(tan 30%, transparent 0),
            radial-gradient(tan 30%, transparent 0);
            background-size: 30px 30px;
            background-position: 0 0, 15px 15px;
          </code>
        </section>
        <section>
          <div id="eg-1-6-5"></div>
          <code>
            background: #eee;
            background-image:
            linear-gradient(45deg, #bbb 25%, transparent 0),
            linear-gradient(45deg, transparent 75%, #bbb 0),
            linear-gradient(45deg, #bbb 25%, transparent 0),
            linear-gradient(45deg, transparent 75%, #bbb 0);
            background-size: 30px 30px;
            background-position: 0 0, 15px 15px,15px 15px,30px 30px;
          </code>
        </section>
        <section>
          <p>
            复杂的背景参考：
            <a href="http://bennettfeely.com/gradients/">http://bennettfeely.com/gradients/</a>
          </p>
        </section>
      </section>
      <section id="c-1-7" class="c-section">
        <h3>{{ $t("lang.directory[0].sections[6]") }}</h3>
        <section>
          <div id="eg-1-7-1">content</div>
          <code>
            padding: 1em;
            border: 1em solid transparent;
            background: linear-gradient(white, white) padding-box,
            repeating-linear-gradient(-45deg,
            red 0, red 12.5%,
            transparent 0, transparent 25%,
            #58a 0, #58a 37.5%,
            transparent 0, transparent 50%)
            0 / 5em 5em;
          </code>
        </section>
        <section>
          <div id="eg-1-7-2">content</div>
          <code>
            @keyframes ants { to { background-position: 100% } }

            #eg-1-7-2{
              &nbsp;padding: 1em;
              &nbsp;border: 1px solid transparent;
              &nbsp;background:
              linear-gradient(white, white) padding-box,
              repeating-linear-gradient(-45deg,
              black 0, black 25%, white 0, white 50%
              ) 0 / .6em .6em;
              &nbsp;animation: ants 12s linear infinite;
            }
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
