<template lang="html">
  <div class="content">
    <section id="c-6" class="c-chapter">
      <h2>{{ $t("lang.directory[5].chapter") }}</h2>
      <section id="c-6-1" class="c-section">
        <h3>{{ $t("lang.directory[5].sections[0]") }}</h3>
        <div id="eg-6-1-1">
          <p>Enjoy playing with this little kitty! Look at its tiny claws,its bright eys,pointed ears,and soft belly!</p>
          <figure class="figure">
            <img src="http://csssecrets.io/images/adamcatlace-before.jpg" alt="kitty" class="img">
            <figcaption>Enjoy playing with this little kitty! Look at its tiny claws,its bright eys,pointed ears,and soft belly!</figcaption>
          </figure>
          <p>Enjoy playing with this little kitty! Look at its tiny claws,its bright eys,pointed ears,and soft belly!</p>
        </div>
        <code>
          figure {
          	max-width: 300px;
          	max-width: min-content;
          	margin: auto;
          }

          figure > img { max-width: inherit }
        </code>
      </section>
      <section id="c-6-2" class="c-section">
        <h3>{{ $t("lang.directory[5].sections[1]") }}</h3>
        <div id="eg-6-2-1">
          <h4>With table-layout: auto</h4>
          <table v-for="table in tables">
            <tbody>
              <tr v-for="tr in table">
                <td v-if="!td.hasOwnProperty('styles')" v-for="td in tr" >
                  <img v-if="td.hasOwnProperty('imgSrc')" :src="td.imgSrc" alt="pics">
                  <span v-else>{{td}}</span>
                </td>
                <td v-if="td.hasOwnProperty('styles')" v-for="td in tr"  :class="td.styles">{{td.content}}</td>
              </tr>
            </tbody>
          </table>
          <ul class="explanation">
            <li>如果没有设置单元格宽度，宽度将会随着内容而分配。宽的单元格也较宽</li>
            <li>所有的行都会参与计算</li>
            <li>当给两个单元格分别 1000px 和 2000px 的宽度，由于表格没有这么宽，表格最终的宽会按比例减少，分别变为33.3%和66.6%</li>
            <li>阻止自动换行 text-overflow: ellipsis 失效</li>
          </ul>
          <h4>With table-layout: fixed</h4>
          <table v-for="table in tables" class="fixed">
            <tbody>
              <tr v-for="tr in table">
                <td v-if="!td.hasOwnProperty('styles')" v-for="td in tr" >
                  <img v-if="td.hasOwnProperty('imgSrc')" :src="td.imgSrc" alt="pics">
                  <span v-else>{{td}}</span>
                </td>
                <td v-if="td.hasOwnProperty('styles')" v-for="td in tr"  :class="td.styles">{{td.content}}</td>
              </tr>
            </tbody>
          </table>
          <code>
            table-layout: fixed</code>
          <p>如果想看表格到底多么长，可以审查元素将，content 的 <code class="inline">overflow：hideden</code>去掉</p>
        </div>
      </section>
      <section id="c-6-3" class="c-section">
        <h3>{{ $t("lang.directory[5].sections[2]") }}</h3>
        <h4>select the first of a certain number of list</h4>
        <div id="eg-6-3-1">
          <ul class="list first">
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
          <ul class="list first">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
          </ul>
          <ul class="list first">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
          </ul>
        </div>
        <p>Here we use less to make our code become less verbose</p>
        <code>
          .nItems(@n,@content){
            &amp;:first-child:nth-last-child(@{n}),
            &amp;:first-child:nth-last-child(@{n}) ~ &amp; {
              @content();
            }
          }

          .nItems(4,{
              content...
          });

          .nItems(6,{
              content...
          });
        </code>
        <p>Here the first items of lists which have 4 and 6 items are given different styles.</p>
        <p>这里有4项和6项的列表的首相有不同的样式。</p>
        <h4>select a range of a certain number of list</h4>
        <div id="eg-6-3-2">
          <ul class="list second">
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
          <ul class="list second">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
          </ul>
          <ul class="list second">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
          </ul>
          <ul class="list second">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
          </ul>
          <ul class="list second">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li>7</li>
          </ul>
        </div>
        <p>the Example above</p>
        <p>lists which contains at most 4 items have yellow border.</p>
        <p>不超过4项的列表有黄色边框。</p>
        <p>lists which contains at least 4 items have a green background.</p>
        <p>超过4项的有绿色背景</p>
        <p>lists which contains 2-6 items have a check at the top-right corner.</p>
        <p>项目数在2-6之间的有check标记。</p>
        <h4>An Example from the book, using js to style sibling items.</h4>
        <div id="eg-6-3-3">
          <palette></palette>
        </div>
        <p>Here we only list related code</p>
        <code>
          /* Hide "color" 4 items or more */
          /* 隐藏 "color" 字符 当有4项或以上时 */
          .palette li:first-child:nth-last-child(n+4) .color-options a:after,
          .palette li:first-child:nth-last-child(n+4) ~ li .color-options a:after {
          	content: none;
          }

          /* Hide word when 6 items or more */
          /* 隐藏文字，当有6项或更多时 */
          .palette li:first-child:nth-last-child(n+6) .color-options a,
          .palette li:first-child:nth-last-child(n+6) ~ li .color-options a {
          	color: transparent;
          	font-size: 0;
          }

          /* Hide “delete” button when only 1 items contained */
          /* 隐藏删除按钮，只有一项时*/
          .palette li:only-child .delete {
          	display:none;
          }
        </code>
      </section>
      <section id="c-6-4" class="c-section">
        <h3>{{ $t("lang.directory[5].sections[3]") }}</h3>
        <router-link :to="{ path: '/fluidBg' }" target="_blank">查看示例</router-link>
        <p>展示页面布局的单开一页。</p>
        <p>这里想要表达的是，之前对于这样的布局通常是在外层元素内包裹一层元素，设置宽度，并给予
          <code class="inline">margin: auto</code>，为了让我们的 code 更加 dry，省去包裹元素的做法，就是给外层元素一个计算的padding</p>
        <code>
          max-width: 900px;
          padding: 1em calc(50% - 450px);
        </code>
      </section>
      <section id="c-6-5" class="c-section">
        <h3>{{ $t("lang.directory[5].sections[4]") }}</h3>
        <h4>The absolute positioning solution</h4>
        <router-link :to="{ path: '/verticalCenter/' + 'absPos1'}"  target="_blank"> 点击查看例子，运用 cal()</router-link>
        <code>
          .main1{
            position: absolute;
            top: calc(~"50% - 3em");
            left: calc(~"50% - 6em");
            width: 12em;
            height: 6em;
          }
        </code>
        <router-link :to="{ path: '/verticalCenter/' + 'absPos2' }" target="_blank">点击查看例子，运用 translate</router-link>
        <code>
          .main2{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        </code>
        <h4>The viewport unit solution</h4>
        <router-link :to="{ path: '/verticalCenter/' + 'viewport' }" target="_blank">点击查看运用 viewpoint 的例子</router-link>
        <code>
          .main3{
            width: 12em;
            margin: 50vh auto 0;
            transform: translateY(-50%);
          }
        </code>
        <h4>The Flexbox solution </h4>
        <router-link :to="{ path: '/verticalCenter/' + 'flexbox1' }" target="_blank">点击查看运用 flexbox 的例子</router-link>
        <code>
          .main4{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 12em;
            margin: auto;
          }
          .bodyForFlex{
            display: flex;
          }
        </code>
        <router-link :to="{ path: '/verticalCenter/' + 'flexbox2' }" target="_blank">我觉得这样写更好～～A better flexbox solution I think</router-link>
        <code>
          .main5{
            width: 12em;
          }
          .myFlexBody{
            display: flex;
            justify-content: center;
            align-items: center;
          }
        </code>
      </section>
      <section id="c-6-6" class="c-section">
        <h3>{{ $t("lang.directory[5].sections[5]") }}</h3>
        <router-link :to="{ path: '/stickyFooter/' }" target="_blank">查看示例</router-link>
      </section>
    </section>
  </div>
</template>

<script>
import tables from '../data/c6s2table.js'
import palette from '../components/Palette.vue'
export default {
  data (){
    return {
      tables: tables
    }
  },
  components: {
    palette
  }
}
</script>
