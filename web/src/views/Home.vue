<template>
  <div>
    <swiper :options="swiperOption">
      <swiper-slide>
        <img class="w-100" src="../assets/images/swiper-item-1.jpeg" alt />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/swiper-item-2.jpeg" alt />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/swiper-item-3.jpeg" alt />
      </swiper-slide>
      <swiper-slide>
        <img class="w-100" src="../assets/images/swiper-item-4.jpeg" alt />
      </swiper-slide>
      <div class="swiper-pagination pagination-home text-right px-3 pb-2" slot="pagination"></div>
    </swiper>
    <!-- 幻灯片结束 -->
    <div class="nav-icons bg-white mt-3 text-center pt-3 text-dark-1">
      <div class="d-flex flex-wrap">
        <div class="nav-item mb-3" v-for="n in 10" :key="n">
          <i class="sprit sprit-story"></i>
          <div class="py-2">爆料站</div>
        </div>
      </div>
      <div class="bg-light py-2 fs-sm">
        <i class="sprit sprit-arrow mr-1"></i>
        <span>收起</span>
      </div>
    </div>
    <!-- nav icon 结束 -->
    <!-- <i class="iconfont icon-menu"></i> -->
    <!-- <m-card icon="menu" title="新闻资讯">
      <div class="nav jc-between">
        <div class="nav-item">
          <div class="nav-link">热门</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">新闻</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">活动</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">公告</div>
        </div>
        <div class="nav-item">
          <div class="nav-link">赛事</div>
        </div>
      </div>

      <div class="pt-3">
        <swiper>
          <swiper-slide v-for="m in 5" :key="m">
            <div class="py-2" v-for="n in 5" :key="n">
              <span>[新闻]</span>
              <span>|</span>
              <span>10.5云顶之弈更新：元素崛起排位赛即将结束</span>
              <span>06/02</span>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </m-card>-->

    <m-list-card icon="menu" title="新闻资讯" :categories="newsCats">
      <template #items="{category}">
        <router-link
          class="py-2 fs-lg d-flex"
          v-for="(news, i) in category.newsList"
          :key="i"
          tag="div"
          :to="`/articles/${news._id}`"
        >
          <!-- <div>{{news}}</div> -->
          <span class="text-info">[{{news.categoryName || '热门'}}]</span>
          <span class="px-2">|</span>
          <span class="flex-1 text-dark-1 text-ellipsis pr-2">{{news.title}}</span>
          <span class="text-grey-1 fs-sm">{{news.createdAt | date}}</span>
        </router-link>
      </template>
    </m-list-card>

    <m-list-card icon="huangguan" title="英雄列表" :categories="heroCats">
      <template #items="{category}">
        <div class="d-flex flex-wrap" style="margin: 0 -0.5rem">
          <router-link
            tag="div" 
            class="p-2 text-center"
            style="width: 20%"
            v-for="(hero, i) in category.heroList"
            :key="i"
            :to="`/heros/${hero._id}`"
          >
            <img :src="hero.avator" alt class="w-100" />
            <div>{{hero.name}}</div>
          </router-link>
        </div>
      </template>
    </m-list-card>

    <m-card icon="menu" title="图文攻略"></m-card>
    <m-card icon="menu" title="英雄列表"></m-card>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  filters: {
    date(val) {
      return dayjs(val).format("MM/DD");
    }
  },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".pagination-home"
        }
      },
      newsCats: [],
      heroCats: []
    };
  },
  created() {
    this.fetchNewsCats();
    this.fetchHeroCats();
  },
  methods: {
    async fetchNewsCats() {
      const res = await this.$http.get("news/list");
      this.newsCats = res.data;
      console.log(res.data);
    },
    async fetchHeroCats() {
      const res = await this.$http.get("heroes/list");
      this.heroCats = res.data;
    }
  }
};
</script>


<style lang="scss">
@import "../assets/scss/variables.scss";

.swiper-pagination {
  .swiper-pagination-bullet {
    border-radius: 0.1538rem;
    background: #fff;
    &.swiper-pagination-bullet-active {
      background: #4b67af;
    }
  }
}
.nav-icons {
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  .nav-item {
    width: 25%;
    border-right: 1px solid $border-color;
    &:nth-child(4n) {
      border-left: none;
    }
  }
}
</style>

