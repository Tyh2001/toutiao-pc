<template>
  <div>
    <!-- 发布文章 -->
    <el-card class="box-card">
      <!-- 面包屑 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="!$route.query.id"
          >
            发布文章
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-else
          >
            修改文章
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 下面表单内容 -->
      <div class="text item">
        <el-form
          :model="publish"
          label-width="80px"
          :rules="publishRules"
          ref="publish-form"
        >
          <!-- 标题 -->
          <el-form-item label="标题：" prop="title">
            <el-input v-model="publish.title"></el-input>
          </el-form-item>

          <!-- 内容 -->
          <el-form-item label="内容：" prop="content">
            <el-tiptap
              v-model="publish.content"
              :extensions="extensions"
              lang="en"
            />
          </el-form-item>

          <!-- 封面 -->
          <el-form-item label="封面：">
            <el-radio-group v-model="publish.cover.type">
              <el-radio :label="1" @click.native="radio(1)">单图</el-radio>
              <el-radio :label="3" @click.native="radio(3)">三图</el-radio>
              <el-radio :label="0" @click.native="radio(0)">无图</el-radio>
              <el-radio :label="-1" @click.native="radio(-1)">自动</el-radio>
            </el-radio-group>
            <br>
            <template v-if="publish.cover.type > 0">
              <CoverImg
                v-for="(type, index) in publish.cover.type"
                :key="index"
                @up-image="upImages(index, $event)"
                :coverImg="publish.cover.images[index]"
              />
            </template>
          </el-form-item>

          <!-- 频道 -->
          <el-form-item label="频道：" prop="channel_id">
            <el-select v-model="publish.channel_id" placeholder="请选择频道">
              <el-option
                v-for="(channel, index) in channels"
                :key="index"
                :label="channel.name"
                :value="channel.id"
              />
            </el-select>
          </el-form-item>

          <!-- 发表按钮 -->
          <el-form-item
            v-if="!$route.query.id"
          >
            <el-button
              type="primary"
              @click="releaseArticle"
            >
              发表
            </el-button>
            <el-button>存入草稿</el-button>
          </el-form-item>

          <!-- 修改按钮 -->
          <el-form-item
            v-else
          >
            <el-button
              type="success"
              @click="releaseArticle"
            >
              修改
            </el-button>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
// 获取频道列表 - 发布文章 - 获取指定文章 - 修改文章
import {
  getChannels,
  addArticles,
  getArticleItem,
  changeArticle
} from '@/api/article'
import 'element-tiptap/lib/index.css' // 引入富文本编辑器的样式
// 引入富文本编辑器
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList
} from 'element-tiptap'
// 封面上传组件
import CoverImg from './components/CoverImg'
export default {
  name: 'publishIndex',
  components: {
    'el-tiptap': ElementTiptap, // 注册富文本编辑器
    CoverImg // 封面上传组件
  },
  data () {
    return {
      channels: [], // 频道列表
      publish: {
        title: '', // 标题
        content: '', // 内容
        cover: { // 封面
          type: 0,
          images: []
        },
        channel_id: null // 频道 id
      },
      // 表单验证
      publishRules: {
        // 标题
        title: [
          { required: true, message: '内容必填', trigger: 'blur' },
          { min: 5, max: 30, message: '标题长度介于5-30个字符', trigger: 'blur' }
        ],
        // 内容
        content: [
          {
            validator (rule, value, callback) {
              if (value === '' || value === '<p></p>') {
                return callback(new Error('内容必填'))
              } else {
                callback()
              }
            }
          }
        ],
        // 频道
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      },
      // 富文本编辑器
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }),
        new Underline({ bubble: true, menubar: false }),
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList()
      ]
    }
  },
  created () {
    this.loadgetChannels() // 获取频道列表

    // this.$route.query.id 如果路径中有 id 这个参数 那么代表要编辑文章
    if (this.$route.query.id) {
      this.loadgetArticleItem() // 获取指定文章
    }
  },
  methods: {
    // 获取频道列表
    async loadgetChannels () {
      const { data } = await getChannels()
      // console.log(data)
      this.channels = data.data.channels // 获取频道列表
    },
    // 发布文章
    releaseArticle () {
      this.$refs['publish-form'].validate((valid) => {
        // 表单验证不通过直接返回 通过就执行发布的方法
        if (!valid) {
          return
        }
        this.release()
      })
    },
    // 发布文章 方法
    release () {
      // 如果 id 有值 那么就修改文章
      if (this.$route.query.id) {
        changeArticle(
          this.$route.query.id,
          this.publish,
          false
        ).then(res => {
          this.$message({
            showClose: true,
            message: '恭喜你，修改成功！',
            type: 'success'
          })
        })
        this.$router.push('/article')
      } else {
        // 否则就执行发布文章操作
        addArticles(this.publish).then(res => {
          this.$message({
            showClose: true,
            message: '恭喜你，发布成功！',
            type: 'success'
          })
          this.$router.push('/article')
        }).catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: '发布失败！',
            type: 'warning'
          })
        })
      }
    },
    // 获取指定文章
    async loadgetArticleItem () {
      const { data } = await getArticleItem(this.$route.query.id)
      this.publish = data.data // 内容
    },
    // 需要上传的图片
    upImages (index, url) {
      // 将需要上传的图片路径传递到数组中去
      this.publish.cover.images[index] = url
    },
    // 如果在编辑状态再次点击 单图 三图 或者无图 则将数组中的数据删除
    radio (number) {
      // 如果选择1图 则把数组清空 只保留第一个
      if (number === 1 && this.publish.cover.images.length > 1) {
        const img1 = this.publish.cover.images[0]
        this.publish.cover.images = []
        this.publish.cover.images.push(img1)
      } else if (number === 0 || (number === -1 && this.publish.cover.images.length >= 1)) {
        this.publish.cover.images = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  max-width: 700px;
}
/deep/ .el-tiptap-editor__content {
  height: 260px !important;
}
</style>
