<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <!-- 章节小节 -->
    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
        <li
            v-for="chapter in chapterVideoList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}

                <span class="acts">
                    <el-button type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                    <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="deleteEditChapter(chapter.id)">删除</el-button>
                </span>
            </p>

            <!-- 视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                        <span class="acts">
                            <el-button type="text">编辑</el-button>
                            <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>
    <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>


    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter/chapter.js'
import video from '@/api/edu/video/video.js'
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled:false,
      chapterVideoList:[],
      courseId: '',
      //新增章节弹框
      dialogChapterFormVisible:false,
      chapter: {
        title: '',
        sort: 0,
        courseId:''
      },
      dialogVideoFormVisible:false,
      //小节对象
      video: {
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: '',
        chapterId: '',
        courseId: ''
      },
    }
  },

  created() {
    console.log('chapter created')
    //获取路由id的值
    if(this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getChapterVideo()
    }
  },

  methods: {
    //-------------------------------------小节部分---------------------
    //删除小节
    removeVideo(id) {
        this.$confirm('此操作删除小节, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              video.deleteVideo(id)
                .then(res => {
                this.$message({
                  type: 'success',
                  message: '删除小节成功!'
                });
                //重新刷新数据
                this.getChapterVideo()
                }).catch(err => { 
                  console.log(err)
              })
        })
    },
    //打开小节的弹框
    openVideo(id) {
        this.video = {}
        this.dialogVideoFormVisible = true
        //设置章节id
        this.video.chapterId = id;
        //设置课程id
        this.video.courseId = this.courseId;
    },
    //添加小节
    addVideo() {
        video.addVideo(this.video).then(res => {
          this.dialogVideoFormVisible = false
          this.$message({
            type:'success',
            message: '添加小节成功'
          })
          //刷新页面
          this.getChapterVideo()
        })
    },
    saveOrUpdateVideo() {
        this.addVideo()
    },



    //--------------------------------------章节部分
    openChapterDialog() {
      this.dialogChapterFormVisible = true
      this.chapter.title = '',
      this.chapter.sort = 0;
    },
    addChapter() {
      //设置课程id到chapter对象里
      this.chapter.courseId = this.courseId;
      chapter.addChapter(this.chapter).then(res => {
          this.dialogChapterFormVisible = false
          this.$message({
            type:'success',
            message: '添加章节成功'
          })
          this.getChapterVideo()
      })
    },
    openEditChapter(id) {
        //修改章节 弹框数据回显
        this.dialogChapterFormVisible = true
        chapter.getChapterInfo(id).then(res => {
          this.chapter = res.data.chapter
        })
    },
    updateChapter() {
      chapter.updateChapter(this.chapter).then(res => {
          this.dialogChapterFormVisible = false
          this.$message({
            type:'success',
            message: '修改章节成功'
          })
          this.getChapterVideo()
      })
    },
    saveOrUpdate() {
      if(this.chapter.id) {
        //有id就是修改操作
        this.updateChapter()
      }else {
        //没有id就是添加操作
        this.addChapter()
      }
    },
    //删除章节
    deleteEditChapter(id) {
      this.$confirm('此操作删除章节, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              chapter.deleteChapter(id)
                .then(res => {
                  this.getChapterVideo()
                }).catch(err => { 
                  console.log(err)
              })
        })
    },
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId).then(res => {
        this.chapterVideoList = res.data.allChapterVideo;
      })
    },
    previous() {
      console.log('previous')
      this.$router.push({ path: `/course/info/${this.courseId}` })
    },

    next() {
      console.log('next')
      this.$router.push({ path: `/course/publish/${this.courseId}` })
    }
  }
}
</script>


<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>