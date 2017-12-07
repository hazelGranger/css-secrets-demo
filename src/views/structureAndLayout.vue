<template lang="html">
  <div class="content">
    <section class="c-6">
      <h2>Structure &amp; Layout 结构与布局</h2>
      <section id="c-6-1">
        <h3>Intrinsic sizing 自适应内部元素</h3>
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
      <section id="c-6-2">
        <h3>Taming table column widths 精确控制表格列宽</h3>
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
      <section id="c-6-3">
        <h3>Styling by sibling count 根据兄弟元素的数量来设置样式</h3>
        <h4>select a certain number of list</h4>
        <div id="eg-6-3-1">
          <ul class="list">
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
          <ul class="list">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
          </ul>
          <ul class="list">
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
      </section>
    </section>
  </div>
</template>

<script>
import tables from '../data/c6s2table.js'
export default {
  data (){
    return {
      tables: tables
    }
  }
}
</script>
