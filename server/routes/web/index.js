module.exports = app => {
  // const express = require('express')
  const router = require('express').Router()
  // const mongoose = require('mongoose')
  const Article = require('../../modules/Article')
  const Hero = require('../../modules/Hero')
  const Category = require('../../modules/Category')
  // const Article = mongoose.model('Article')
  // const Category = mongoose.model('Category')


  // 导入新闻数据
  router.get('/news/init', async (req, res) => {
    const parent = await Category.findOne({
      name: '新闻分类'
    })
    const cats = await Category.find().where({
      parent: parent
    }).lean()
    const newsTitles = [
      '豪门对决新秀 EDG能否打破ES不败金身',
      '【LPL选手故事】Meteor—变轨星辰也能照亮另一片天空',
      'FPX志在重铸统治力 xiye回归首发',
      '白色情人节精选皮肤5折优惠',
      '10.5云顶之弈更新：元素崛起排位赛即将结束',
      '10.5版本更新公告：卡莎妮蔻加强 黯晶系列皮肤来袭',
      '云顶之弈银河战争设计师专访',
      '豪门对决新秀 EDG能否打破ES不败金身',
      'LPL选手故事】Meteor—变轨星辰也能照亮另一片天空',
      'FPX志在重铸统治力 xiye回归首发',
      '10.5云顶三大S级阵容 月蚀雷霆刺成T1选择',
      '10.5国服五大崛起上单 潘森胜率暴涨为第一',
      '云顶极地狂战士加强！ 三套狂战阵容助你上分',
      '一图看懂盟牙有礼活动！外星人至臻赛娜等你拿',
      '一图速看云顶之弈10.5生态 月蚀雷霆劫王者归',
      '10.4国服登场率Top5 圣枪游侠重回榜首',
      '10.5云顶改动前瞻解析！剑士梦魇齐加强玩法回',
      'Faker韩服黑科技盘点！迅步瑟提制霸中路',
      '10.4五路老年选手首选英雄 茂凯领衔效率上分',
      '双飓风极冰流EZ 10.4云顶国服新套路',
      '伤害与生存兼顾 下路冰枪法核强势来袭',
      '3个S级羁绊版本之子 云顶速成型千珏体系',
      '一图速看10.4版本生态环境 上单腕豪大热非Ban',
      '10.4版本云顶羁绊评级！炼狱召唤使成版本宠儿',
      'AP刺客成国服排位主流！皎月鱼人领衔高登场率',
      '10.4云顶国服高胜率阵容！极地守护神成版本新',
      '10.4云顶国服高胜率阵容！极地守护神成版本新',
    ]
    const newsList = newsTitles.map(title => {
      const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
      return {
        categories: randomCats.slice(0, 2) || [],
        title: title
      }
    })
    await Article.deleteMany({})
    await Article.insertMany(newsList)
    res.send(newsList)
  })

  // 新闻列表接口
  router.get('/news/list', async (req, res) => {
    // const parent = await Category.findOne({
    //   name: '新闻分类'
    // }).populate({
    //   path: 'children',
    //   populate: {
    //     path: 'newsList'
    //   }
    // }).lean()
    // res.send(parent)
    const parent = await Category.findOne({
      name: '新闻分类'
    })
    const cats = await Category.aggregate([{
        $match: {
          parent: parent._id
        }
      },
      {
        $lookup: {
          from: 'articles',
          localField: '_id',
          foreignField: 'categories',
          as: 'newsList'
        }
      },
    ])
    const subCats = cats.map(v => v._id)

    cats.unshift({
      name: '热门',
      newsList: await Article.find().where({
        categories: {
          $in: subCats
        }
      }).limit(5).lean()
    })

    cats.map(cat => {
      // console.log(1)
      //  console.log(cat)
      // console.log('ok')
      cat.newsList.map(news => {
        // console.log(2)
        news.categoryName = (cat.name === '热门') ? news.categories[0].name : cat.name
        // console.log('ok')
        return news
      })
      // console.log(3)
      return cat
    })
    res.send(cats)
  })

  // 导入英雄数据
  router.get('/heroes/init', async (req, res) => {
    const rawData = [{
        "name": "所有英雄",
        "heros": [{
          "name": "黑暗之女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Annie.png"
        }, {
          "name": "狂战士",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Olaf.png"
        }, {
          "name": "正义巨像",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Galio.png"
        }, {
          "name": "卡牌大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/TwistedFate.png"
        }, {
          "name": "德邦总管",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/XinZhao.png"
        }, {
          "name": "无畏战车",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Urgot.png"
        }, {
          "name": "诡术妖姬",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Leblanc.png"
        }, {
          "name": "猩红收割者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Vladimir.png"
        }, {
          "name": "末日使者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/FiddleSticks.png"
        }, {
          "name": "正义天使",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kayle.png"
        }, {
          "name": "无极剑圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MasterYi.png"
        }, {
          "name": "卡莉斯塔",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Alistar.png"
        }, {
          "name": "瑞兹",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ryze.png"
        }, {
          "name": "亡灵战神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sion.png"
        }, {
          "name": "战争女神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sivir.png"
        }, {
          "name": "众星之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Soraka.png"
        }, {
          "name": "迅捷斥候",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Teemo.png"
        }, {
          "name": "麦林炮手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tristana.png"
        }, {
          "name": "祖安怒兽",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Warwick.png"
        }, {
          "name": "雪之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nunu.png"
        }, {
          "name": "赏金猎人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MissFortune.png"
        }, {
          "name": "寒冰射手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ashe.png"
        }, {
          "name": "蛮族之王",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tryndamere.png"
        }, {
          "name": "武器大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Jax.png"
        }, {
          "name": "莫甘娜",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Morgana.png"
        }, {
          "name": "时光守护者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Zilean.png"
        }, {
          "name": "辛吉德",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Singed.png"
        }, {
          "name": "痛苦之拥",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Evelynn.png"
        }, {
          "name": "瘟疫之源",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Twitch.png"
        }, {
          "name": "死神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karthus.png"
        }, {
          "name": "虚空恐惧",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Chogath.png"
        }, {
          "name": "阿木木",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Amumu.png"
        }, {
          "name": "龙龟",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Rammus.png"
        }, {
          "name": "冰晶凤凰",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Anivia.png"
        }, {
          "name": "恶魔小丑",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Shaco.png"
        }, {
          "name": "祖安狂人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/DrMundo.png"
        }, {
          "name": "琴瑟仙女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sona.png"
        }, {
          "name": "虚空行者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kassadin.png"
        }, {
          "name": "刀锋舞者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Irelia.png"
        }, {
          "name": "风暴之怒",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Janna.png"
        }, {
          "name": "海洋之灾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Gangplank.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Corki.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karma.png"
        }, {
          "name": "卡尔马",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Taric.png"
        }, {
          "name": "瓦罗兰之盾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Veigar.png"
        }, {
          "name": "小法师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Trundle.png"
        }, {
          "name": "乌鸦",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Swain.png"
        }, {
          "name": "皮城女警",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Caitlyn.png"
        }, {
          "name": "布里奇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Blitzcrank.png"
        }, {
          "name": "石头人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Malphite.png"
        }, {
          "name": "不祥之刃",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Katarina.png"
        }, {
          "name": "永恒梦魇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nocturne.png"
        }, {
          "name": "大树",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Maokai.png"
        }, {
          "name": "鳄鱼",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Renekton.png"
        }, {
          "name": "皇子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/JarvanIV.png"
        }, {
          "name": "蜘蛛",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Elise.png"
        }, {
          "name": "发条精灵",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Orianna.png"
        }, {
          "name": "齐天大圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MonkeyKing.png"
        }]
      },
      {
        "name": "战士",
        "heros": [{
          "name": "黑暗之女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Annie.png"
        }, {
          "name": "狂战士",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Olaf.png"
        }, {
          "name": "正义巨像",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Galio.png"
        }, {
          "name": "卡牌大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/TwistedFate.png"
        }, {
          "name": "德邦总管",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/XinZhao.png"
        }, {
          "name": "无畏战车",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Urgot.png"
        }, {
          "name": "诡术妖姬",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Leblanc.png"
        }, {
          "name": "猩红收割者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Vladimir.png"
        }, {
          "name": "末日使者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/FiddleSticks.png"
        }, {
          "name": "正义天使",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kayle.png"
        }, {
          "name": "无极剑圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MasterYi.png"
        }, {
          "name": "卡莉斯塔",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Alistar.png"
        }, {
          "name": "瑞兹",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ryze.png"
        }, {
          "name": "亡灵战神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sion.png"
        }, {
          "name": "战争女神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sivir.png"
        }, {
          "name": "众星之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Soraka.png"
        }, {
          "name": "迅捷斥候",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Teemo.png"
        }, {
          "name": "麦林炮手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tristana.png"
        }, {
          "name": "祖安怒兽",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Warwick.png"
        }, {
          "name": "雪之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nunu.png"
        }, {
          "name": "赏金猎人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MissFortune.png"
        }, {
          "name": "寒冰射手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ashe.png"
        }, {
          "name": "蛮族之王",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tryndamere.png"
        }, {
          "name": "武器大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Jax.png"
        }, {
          "name": "莫甘娜",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Morgana.png"
        }, {
          "name": "时光守护者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Zilean.png"
        }, {
          "name": "辛吉德",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Singed.png"
        }, {
          "name": "痛苦之拥",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Evelynn.png"
        }, {
          "name": "瘟疫之源",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Twitch.png"
        }, {
          "name": "死神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karthus.png"
        }, {
          "name": "虚空恐惧",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Chogath.png"
        }, {
          "name": "阿木木",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Amumu.png"
        }, {
          "name": "龙龟",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Rammus.png"
        }, {
          "name": "冰晶凤凰",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Anivia.png"
        }, {
          "name": "恶魔小丑",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Shaco.png"
        }, {
          "name": "祖安狂人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/DrMundo.png"
        }, {
          "name": "琴瑟仙女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sona.png"
        }, {
          "name": "虚空行者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kassadin.png"
        }, {
          "name": "刀锋舞者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Irelia.png"
        }, {
          "name": "风暴之怒",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Janna.png"
        }, {
          "name": "海洋之灾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Gangplank.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Corki.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karma.png"
        }, {
          "name": "卡尔马",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Taric.png"
        }, {
          "name": "瓦罗兰之盾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Veigar.png"
        }, {
          "name": "小法师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Trundle.png"
        }, {
          "name": "乌鸦",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Swain.png"
        }, {
          "name": "皮城女警",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Caitlyn.png"
        }, {
          "name": "布里奇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Blitzcrank.png"
        }, {
          "name": "石头人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Malphite.png"
        }, {
          "name": "不祥之刃",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Katarina.png"
        }, {
          "name": "永恒梦魇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nocturne.png"
        }, {
          "name": "大树",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Maokai.png"
        }, {
          "name": "鳄鱼",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Renekton.png"
        }, {
          "name": "皇子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/JarvanIV.png"
        }, {
          "name": "蜘蛛",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Elise.png"
        }, {
          "name": "发条精灵",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Orianna.png"
        }, {
          "name": "齐天大圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MonkeyKing.png"
        }]
      },
      {
        "name": "法师",
        "heros": [{
          "name": "黑暗之女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Annie.png"
        }, {
          "name": "狂战士",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Olaf.png"
        }, {
          "name": "正义巨像",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Galio.png"
        }, {
          "name": "卡牌大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/TwistedFate.png"
        }, {
          "name": "德邦总管",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/XinZhao.png"
        }, {
          "name": "无畏战车",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Urgot.png"
        }, {
          "name": "诡术妖姬",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Leblanc.png"
        }, {
          "name": "猩红收割者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Vladimir.png"
        }, {
          "name": "末日使者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/FiddleSticks.png"
        }, {
          "name": "正义天使",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kayle.png"
        }, {
          "name": "无极剑圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MasterYi.png"
        }, {
          "name": "卡莉斯塔",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Alistar.png"
        }, {
          "name": "瑞兹",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ryze.png"
        }, {
          "name": "亡灵战神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sion.png"
        }, {
          "name": "战争女神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sivir.png"
        }, {
          "name": "众星之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Soraka.png"
        }, {
          "name": "迅捷斥候",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Teemo.png"
        }, {
          "name": "麦林炮手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tristana.png"
        }, {
          "name": "祖安怒兽",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Warwick.png"
        }, {
          "name": "雪之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nunu.png"
        }, {
          "name": "赏金猎人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MissFortune.png"
        }, {
          "name": "寒冰射手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ashe.png"
        }, {
          "name": "蛮族之王",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tryndamere.png"
        }, {
          "name": "武器大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Jax.png"
        }, {
          "name": "莫甘娜",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Morgana.png"
        }, {
          "name": "时光守护者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Zilean.png"
        }, {
          "name": "辛吉德",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Singed.png"
        }, {
          "name": "痛苦之拥",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Evelynn.png"
        }, {
          "name": "瘟疫之源",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Twitch.png"
        }, {
          "name": "死神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karthus.png"
        }, {
          "name": "虚空恐惧",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Chogath.png"
        }, {
          "name": "阿木木",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Amumu.png"
        }, {
          "name": "龙龟",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Rammus.png"
        }, {
          "name": "冰晶凤凰",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Anivia.png"
        }, {
          "name": "恶魔小丑",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Shaco.png"
        }, {
          "name": "祖安狂人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/DrMundo.png"
        }, {
          "name": "琴瑟仙女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sona.png"
        }, {
          "name": "虚空行者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kassadin.png"
        }, {
          "name": "刀锋舞者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Irelia.png"
        }, {
          "name": "风暴之怒",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Janna.png"
        }, {
          "name": "海洋之灾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Gangplank.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Corki.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karma.png"
        }, {
          "name": "卡尔马",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Taric.png"
        }, {
          "name": "瓦罗兰之盾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Veigar.png"
        }, {
          "name": "小法师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Trundle.png"
        }, {
          "name": "乌鸦",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Swain.png"
        }, {
          "name": "皮城女警",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Caitlyn.png"
        }, {
          "name": "布里奇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Blitzcrank.png"
        }, {
          "name": "石头人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Malphite.png"
        }, {
          "name": "不祥之刃",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Katarina.png"
        }, {
          "name": "永恒梦魇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nocturne.png"
        }, {
          "name": "大树",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Maokai.png"
        }, {
          "name": "鳄鱼",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Renekton.png"
        }, {
          "name": "皇子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/JarvanIV.png"
        }, {
          "name": "蜘蛛",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Elise.png"
        }, {
          "name": "发条精灵",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Orianna.png"
        }, {
          "name": "齐天大圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MonkeyKing.png"
        }]
      },
      {
        "name": "刺客",
        "heros": [{
          "name": "黑暗之女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Annie.png"
        }, {
          "name": "狂战士",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Olaf.png"
        }, {
          "name": "正义巨像",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Galio.png"
        }, {
          "name": "卡牌大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/TwistedFate.png"
        }, {
          "name": "德邦总管",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/XinZhao.png"
        }, {
          "name": "无畏战车",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Urgot.png"
        }, {
          "name": "诡术妖姬",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Leblanc.png"
        }, {
          "name": "猩红收割者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Vladimir.png"
        }, {
          "name": "末日使者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/FiddleSticks.png"
        }, {
          "name": "正义天使",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kayle.png"
        }, {
          "name": "无极剑圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MasterYi.png"
        }, {
          "name": "卡莉斯塔",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Alistar.png"
        }, {
          "name": "瑞兹",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ryze.png"
        }, {
          "name": "亡灵战神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sion.png"
        }, {
          "name": "战争女神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sivir.png"
        }, {
          "name": "众星之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Soraka.png"
        }, {
          "name": "迅捷斥候",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Teemo.png"
        }, {
          "name": "麦林炮手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tristana.png"
        }, {
          "name": "祖安怒兽",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Warwick.png"
        }, {
          "name": "雪之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nunu.png"
        }, {
          "name": "赏金猎人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MissFortune.png"
        }, {
          "name": "寒冰射手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ashe.png"
        }, {
          "name": "蛮族之王",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tryndamere.png"
        }, {
          "name": "武器大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Jax.png"
        }, {
          "name": "莫甘娜",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Morgana.png"
        }, {
          "name": "时光守护者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Zilean.png"
        }, {
          "name": "辛吉德",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Singed.png"
        }, {
          "name": "痛苦之拥",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Evelynn.png"
        }, {
          "name": "瘟疫之源",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Twitch.png"
        }, {
          "name": "死神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karthus.png"
        }, {
          "name": "虚空恐惧",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Chogath.png"
        }, {
          "name": "阿木木",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Amumu.png"
        }, {
          "name": "龙龟",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Rammus.png"
        }, {
          "name": "冰晶凤凰",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Anivia.png"
        }, {
          "name": "恶魔小丑",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Shaco.png"
        }, {
          "name": "祖安狂人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/DrMundo.png"
        }, {
          "name": "琴瑟仙女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sona.png"
        }, {
          "name": "虚空行者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kassadin.png"
        }, {
          "name": "刀锋舞者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Irelia.png"
        }, {
          "name": "风暴之怒",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Janna.png"
        }, {
          "name": "海洋之灾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Gangplank.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Corki.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karma.png"
        }, {
          "name": "卡尔马",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Taric.png"
        }, {
          "name": "瓦罗兰之盾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Veigar.png"
        }, {
          "name": "小法师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Trundle.png"
        }, {
          "name": "乌鸦",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Swain.png"
        }, {
          "name": "皮城女警",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Caitlyn.png"
        }, {
          "name": "布里奇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Blitzcrank.png"
        }, {
          "name": "石头人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Malphite.png"
        }, {
          "name": "不祥之刃",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Katarina.png"
        }, {
          "name": "永恒梦魇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nocturne.png"
        }, {
          "name": "大树",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Maokai.png"
        }, {
          "name": "鳄鱼",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Renekton.png"
        }, {
          "name": "皇子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/JarvanIV.png"
        }, {
          "name": "蜘蛛",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Elise.png"
        }, {
          "name": "发条精灵",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Orianna.png"
        }, {
          "name": "齐天大圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MonkeyKing.png"
        }]
      },
      {
        "name": "坦克",
        "heros": [{
          "name": "黑暗之女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Annie.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Olaf.png"
        }, {
          "name": "正义巨像",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Galio.png"
        }, {
          "name": "卡牌大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/TwistedFate.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/XinZhao.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Urgot.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Leblanc.png"
        }, {
          "name": "猩红收割者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Vladimir.png"
        }, {
          "name": "末日使者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/FiddleSticks.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kayle.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MasterYi.png"
        }, {
          "name": "牛头酋长",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Alistar.png"
        }, {
          "name": "符文法师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ryze.png"
        }, {
          "name": "亡灵战神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sion.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sivir.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Soraka.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Teemo.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tristana.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Warwick.png"
        }, {
          "name": "雪原双子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nunu.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MissFortune.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ashe.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tryndamere.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Jax.png"
        }, {
          "name": "堕落天使",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Morgana.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Zilean.png"
        }, {
          "name": "炼金术士",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Singed.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Evelynn.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Twitch.png"
        }, {
          "name": "死亡颂唱者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karthus.png"
        }, {
          "name": "虚空恐惧",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Chogath.png"
        }, {
          "name": "殇之木乃伊",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Amumu.png"
        }, {
          "name": "披甲龙龟",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Rammus.png"
        }, {
          "name": "冰晶凤凰",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Anivia.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Shaco.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/DrMundo.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sona.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kassadin.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Irelia.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Janna.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Gangplank.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Corki.png"
        }, {
          "name": "天启者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karma.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Taric.png"
        }, {
          "name": "邪恶小法师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Veigar.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Trundle.png"
        }, {
          "name": "诺克萨斯统领",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Swain.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Caitlyn.png"
        }, {
          "name": "蒸汽机器人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Blitzcrank.png"
        }, {
          "name": "熔岩巨兽",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Malphite.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Katarina.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nocturne.png"
        }, {
          "name": "扭曲树精",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Maokai.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Renekton.png"
        }, {
          "name": "德玛西亚皇子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/JarvanIV.png"
        }, {
          "name": "蜘蛛女皇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Elise.png"
        }, {
          "name": "发条魔灵",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Orianna.png"
        }, {
          "name": "",
          "avator": "https://game.gtimg.cn/images/lol/"
        }]
      },
      {
        "name": "射手",
        "heros": [{
          "name": "黑暗之女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Annie.png"
        }, {
          "name": "狂战士",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Olaf.png"
        }, {
          "name": "正义巨像",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Galio.png"
        }, {
          "name": "卡牌大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/TwistedFate.png"
        }, {
          "name": "德邦总管",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/XinZhao.png"
        }, {
          "name": "无畏战车",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Urgot.png"
        }, {
          "name": "诡术妖姬",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Leblanc.png"
        }, {
          "name": "猩红收割者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Vladimir.png"
        }, {
          "name": "末日使者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/FiddleSticks.png"
        }, {
          "name": "正义天使",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kayle.png"
        }, {
          "name": "无极剑圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MasterYi.png"
        }, {
          "name": "卡莉斯塔",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Alistar.png"
        }, {
          "name": "瑞兹",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ryze.png"
        }, {
          "name": "亡灵战神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sion.png"
        }, {
          "name": "战争女神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sivir.png"
        }, {
          "name": "众星之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Soraka.png"
        }, {
          "name": "迅捷斥候",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Teemo.png"
        }, {
          "name": "麦林炮手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tristana.png"
        }, {
          "name": "祖安怒兽",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Warwick.png"
        }, {
          "name": "雪之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nunu.png"
        }, {
          "name": "赏金猎人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MissFortune.png"
        }, {
          "name": "寒冰射手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ashe.png"
        }, {
          "name": "蛮族之王",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tryndamere.png"
        }, {
          "name": "武器大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Jax.png"
        }, {
          "name": "莫甘娜",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Morgana.png"
        }, {
          "name": "时光守护者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Zilean.png"
        }, {
          "name": "辛吉德",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Singed.png"
        }, {
          "name": "痛苦之拥",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Evelynn.png"
        }, {
          "name": "瘟疫之源",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Twitch.png"
        }, {
          "name": "死神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karthus.png"
        }, {
          "name": "虚空恐惧",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Chogath.png"
        }, {
          "name": "阿木木",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Amumu.png"
        }, {
          "name": "龙龟",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Rammus.png"
        }, {
          "name": "冰晶凤凰",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Anivia.png"
        }, {
          "name": "恶魔小丑",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Shaco.png"
        }, {
          "name": "祖安狂人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/DrMundo.png"
        }, {
          "name": "琴瑟仙女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sona.png"
        }, {
          "name": "虚空行者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kassadin.png"
        }, {
          "name": "刀锋舞者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Irelia.png"
        }, {
          "name": "风暴之怒",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Janna.png"
        }, {
          "name": "海洋之灾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Gangplank.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Corki.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karma.png"
        }, {
          "name": "卡尔马",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Taric.png"
        }, {
          "name": "瓦罗兰之盾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Veigar.png"
        }, {
          "name": "小法师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Trundle.png"
        }, {
          "name": "乌鸦",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Swain.png"
        }, {
          "name": "皮城女警",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Caitlyn.png"
        }, {
          "name": "布里奇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Blitzcrank.png"
        }, {
          "name": "石头人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Malphite.png"
        }, {
          "name": "不祥之刃",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Katarina.png"
        }, {
          "name": "永恒梦魇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nocturne.png"
        }, {
          "name": "大树",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Maokai.png"
        }, {
          "name": "鳄鱼",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Renekton.png"
        }, {
          "name": "皇子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/JarvanIV.png"
        }, {
          "name": "蜘蛛",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Elise.png"
        }, {
          "name": "发条精灵",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Orianna.png"
        }, {
          "name": "齐天大圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MonkeyKing.png"
        }]
      },
      {
        "name": "辅助",
        "heros": [{
          "name": "黑暗之女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Annie.png"
        }, {
          "name": "狂战士",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Olaf.png"
        }, {
          "name": "正义巨像",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Galio.png"
        }, {
          "name": "卡牌大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/TwistedFate.png"
        }, {
          "name": "德邦总管",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/XinZhao.png"
        }, {
          "name": "无畏战车",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Urgot.png"
        }, {
          "name": "诡术妖姬",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Leblanc.png"
        }, {
          "name": "猩红收割者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Vladimir.png"
        }, {
          "name": "末日使者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/FiddleSticks.png"
        }, {
          "name": "正义天使",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kayle.png"
        }, {
          "name": "无极剑圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MasterYi.png"
        }, {
          "name": "卡莉斯塔",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Alistar.png"
        }, {
          "name": "瑞兹",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ryze.png"
        }, {
          "name": "亡灵战神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sion.png"
        }, {
          "name": "战争女神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sivir.png"
        }, {
          "name": "众星之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Soraka.png"
        }, {
          "name": "迅捷斥候",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Teemo.png"
        }, {
          "name": "麦林炮手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tristana.png"
        }, {
          "name": "祖安怒兽",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Warwick.png"
        }, {
          "name": "雪之子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nunu.png"
        }, {
          "name": "赏金猎人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MissFortune.png"
        }, {
          "name": "寒冰射手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Ashe.png"
        }, {
          "name": "蛮族之王",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Tryndamere.png"
        }, {
          "name": "武器大师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Jax.png"
        }, {
          "name": "莫甘娜",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Morgana.png"
        }, {
          "name": "时光守护者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Zilean.png"
        }, {
          "name": "辛吉德",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Singed.png"
        }, {
          "name": "痛苦之拥",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Evelynn.png"
        }, {
          "name": "瘟疫之源",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Twitch.png"
        }, {
          "name": "死神",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karthus.png"
        }, {
          "name": "虚空恐惧",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Chogath.png"
        }, {
          "name": "阿木木",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Amumu.png"
        }, {
          "name": "龙龟",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Rammus.png"
        }, {
          "name": "冰晶凤凰",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Anivia.png"
        }, {
          "name": "恶魔小丑",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Shaco.png"
        }, {
          "name": "祖安狂人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/DrMundo.png"
        }, {
          "name": "琴瑟仙女",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Sona.png"
        }, {
          "name": "虚空行者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Kassadin.png"
        }, {
          "name": "刀锋舞者",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Irelia.png"
        }, {
          "name": "风暴之怒",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Janna.png"
        }, {
          "name": "海洋之灾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Gangplank.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Corki.png"
        }, {
          "name": "英勇投弹手",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Karma.png"
        }, {
          "name": "卡尔马",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Taric.png"
        }, {
          "name": "瓦罗兰之盾",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Veigar.png"
        }, {
          "name": "小法师",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Trundle.png"
        }, {
          "name": "乌鸦",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Swain.png"
        }, {
          "name": "皮城女警",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Caitlyn.png"
        }, {
          "name": "布里奇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Blitzcrank.png"
        }, {
          "name": "石头人",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Malphite.png"
        }, {
          "name": "不祥之刃",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Katarina.png"
        }, {
          "name": "永恒梦魇",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Nocturne.png"
        }, {
          "name": "大树",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Maokai.png"
        }, {
          "name": "鳄鱼",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Renekton.png"
        }, {
          "name": "皇子",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/JarvanIV.png"
        }, {
          "name": "蜘蛛",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Elise.png"
        }, {
          "name": "发条精灵",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/Orianna.png"
        }, {
          "name": "齐天大圣",
          "avator": "https://game.gtimg.cn/images/lol/act/img/champion/MonkeyKing.png"
        }]
      }
    ]

    for (let cat of rawData) {
      await Hero.deleteMany({})
      if (cat.name === '所有英雄') {
        continue
      }
      // 找到当前分类在数据库中对应的数据
      const category = await Category.findOne({
        name: cat.name
      })
      cat.heros = cat.heros.map(hero => {
        hero.categories = [category]
        return hero
      })
      // 录入英雄
      // console.log(cat.heros)
      await Hero.insertMany(cat.heros)
    }

    res.send(await Hero.find())
  })
  // 英雄列表接口
  router.get('/heroes/list', async (req, res) => {
    const parent = await Category.findOne({
      name: '英雄分类'
    })
    const cats = await Category.aggregate([
      {
        $match: {
          parent: parent._id
        }
      },
      // {
      //   $lookup: {
      //     from: 'heros',
      //     localField: '_id',
      //     foreignField: 'categories',
      //     as: 'heroList'
      //   }
      // },
      {
        $addFields: {
          heroList: await Hero.find()
        }
      }
    ])
    // console.log(cats)
    const subCats = cats.map(v => v._id)
    
    cats.unshift({
      name: '热门',
      heroList: await Hero.find().limit(10).lean()
    })

    res.send(cats)
  })


  // 文章详情
  router.get('/articles/:id', async (req, res) => {
    const data = await Article.findById(req.params.id).lean()
    data.related = await Article.find().where({
      categories: {$in: data.categories}
    }).limit(2)
    res.send(data)
  })

  // 英雄详情
  router.get('/heroes/:id', async (req, res) => {
    const data = await Hero
    .findById(req.params.id)
    .populate('categories')
    .lean()
    res.send(data)
  })

  // app.use(express.json())
  app.use('/web/api', router)
}