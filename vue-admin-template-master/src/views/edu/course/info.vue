<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

  <el-form label-width="120px">
    <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
    </el-form-item>

    <!-- 所属分类 TODO -->
    <el-form-item label="课程类别">
    <el-select
        v-model="courseInfo.subjectParentId"
        placeholder="一级分类" @change="subjectLevelOneChanged">
        <el-option
        v-for="subject in subjectOneList"
        :key="subject.id"
        :label="subject.title"
        :value="subject.id"/>
    </el-select>

    <!-- 二级分类 -->
    <el-select 
        v-model="courseInfo.subjectId" 
        placeholder="二级分类">
        <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
    </el-form-item>

    <!-- 课程讲师 -->
    <el-form-item label="课程讲师">
    <el-select
        v-model="courseInfo.teacherId"
        placeholder="请选择">
        <el-option
        v-for="teacher in teacherList"
        :key="teacher.id"
        :label="teacher.name"
        :value="teacher.id"/>
    </el-select>
    </el-form-item>

    <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
    </el-form-item>

    <!-- 课程简介 TODO -->
    <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
    </el-form-item>

    <!-- 课程封面-->
    <el-form-item label="课程封面">
    <!-- 选择文件则自动上传的组件 -->
    <el-upload
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :action="BASE_API+'/eduoss/fileoss/uploadOssFile'"
        class="avatar-uploader">
        <img :src="courseInfo.cover">
    </el-upload>

    </el-form-item>

    <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
    </el-form-item>

    <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course/course.js'
import subject from '@/api/edu/subject/subject.js'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用,
      teacherList:[],
      //一级分类
      subjectOneList:[],
      //二级分类
      subjectTwoList:[],
      courseInfo: {
        title: '',
        //二级分类id
        subjectId: '',
        //一级分类id
        subjectParentId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/01.jpg',
        price: 0
      },
       //获取dev.env.js里面的值
      BASE_API: process.env.BASE_API,
      courseId:''
    }
  },
  watch:{
    $route(to,from) {
        //监听路由的变化
        this.courseInfo = {}
    }
  },
  created() {
      //获取路由id
      if(this.$route.params && this.$route.params.id) {
          this.courseId = this.$route.params.id
          this.getCourseInfoId()
          //初始化讲师
         this.getAllTeacher()
      }else {
        this.getAllTeacher()
        this.getOneSubject()
      }
     
  },
  methods: {
    //根据课程id查询信息
    getCourseInfoId() {
        course.getCourseInfo(this.courseId).then(res => {
            this.courseInfo = res.data.courseInfoVo
            subject.getAllSubject().then(res => {
              //获取所有一级分类
              this.subjectOneList = res.data.list
              //遍历
              this.subjectOneList.map(v => {
                  if(v.id === this.courseInfo.subjectParentId) {
                      //获取所有的一级分类所有的二级分类  用于回显数据
                      this.subjectTwoList = v.children
                  }
              })
          })
        })
    },
    //上传成功
    handleAvatarSuccess(res, file) {
        this.courseInfo.cover = res.data.url
    },
    //上传之前, 设置图片的类型和大小
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
    },
    //一级分类改变
    subjectLevelOneChanged(value) {
        this.courseInfo.subjectId = ''
        this.subjectOneList.map(i => {
            if(value === i.id) {
                //设置一级分类下面二级分类的值
                this.subjectTwoList = i.children
            }
        })
    },
    //查询所有的一级分类
    getOneSubject() {
        subject.getAllSubject().then(res => {
            this.subjectOneList = res.data.list
        })
    },
    //查询所有讲师
    getAllTeacher() {
        course.getTeacher().then(res => {
            this.teacherList = res.data.items
        })
    },
    //添加课程
    saveCourse() {
        course.addCourseInfo(this.courseInfo).then(res => {
                this.$message({
                    type:'success',
                    message: '添加课程信息成功!'
                })
                    //跳转到第二步
                this.$router.push({ path: `/course/chapter/${res.data.courseId}` })
            })  
    },
    //修改课程
    updateCourse() {
        course.updateCourseInfo(this.courseInfo).then(res => {
            this.$message({
                    type:'success',
                    message: '修改课程信息成功!'
                })
            //跳转到第二步
            this.$router.push({ path: `/course/chapter/${this.courseId}` })
        })
    },
    saveOrUpdate() {
       console.log('next')
       if(!this.courseInfo.id) {
            //添加
            this.saveCourse()
        }else {
            //修改
            this.updateCourse()
        }
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>