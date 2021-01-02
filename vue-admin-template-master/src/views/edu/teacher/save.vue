<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像 -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

          <!-- 头衔缩略图 -->
          <pan-thumb :image="teacher.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
          </el-button>

          <!--
              v-show：是否显示上传组件
              :key：类似于id，如果一个页面多个图片上传控件，可以做区分
              :url：后台上传的url地址
              @close：关闭上传组件
              @crop-upload-success：上传成功后的回调 -->
          <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduoss/fileoss/uploadOssFile'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/edu/teacher/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  components: { ImageCropper, PanThumb },
  data() {
    return{
     teacher: {
       avatar: 'http://edu-hr.oss-cn-beijing.aliyuncs.com/2021/01/02/210c1cb9-aeb5-435d-aa8d-4e785d6dd8a8file.png'
     },
      //保存按钮是否禁用
      saveBtnDisabled: false,
      //上传组件是否显示
      imagecropperShow: false,
      //上传组件的唯一标志
      imagecropperKey: 0,
      //获取dev.env.js里面的值
      BASE_API: process.env.BASE_API
    }
  },
  created() {
     this.init()
  },
  watch: {
    $route(to,from) {
      //监听路由变化的方式
      this.init();
    }
  },
  methods: {
    init() {
      //判断路径中有没有id, 有的话就是修改讲师
      if(this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.getTeacher(id);
      }else {
        this.teacher = {}
      }
    },
    saveOrUpdate() {
       //根据teacher是否有id, 判断是添加的页面还是修改的页面
       if(!this.teacher.id) {
          this.addTeacher()
       }else {
          this.updateTeacher()
       }
    },
    //添加讲师
    addTeacher() {
        teacher.addTeacher(this.teacher)
          .then(res => {
            this.$message({
              type:'success',
              message:'添加成功!'
            });
            //回到列表页面
            this.$router.push({path: '/teacher/table'})
          })
    },
    // 查询讲师
    getTeacher(id) {
      teacher.getTeacher(id)
        .then(res => {
          this.teacher = res.data.teacher
        })
    },

    //修改讲师
    updateTeacher() {
        teacher.updateTeacher(this.teacher)
          .then(res => {
            this.$message({
              type:'success',
              message:'修改成功!'
            });
            //回到列表页面
            this.$router.push({path: '/teacher/table'})
        })
    },
    //关闭上传弹框的方法
    close() {
        this.imagecropperShow = false;
    },
    cropSuccess(data) {
        //上传成功之后返回图片地址
        var url = data.url;
        this.teacher.avatar = data.url;
        //上传成功之后  让标志加1 即可以初始化上传控件
        this.imagecropperKey++;
        this.close()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
