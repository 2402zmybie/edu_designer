import request from '@/utils/request'

export default {
    // 添加课程信息
    addCourseInfo(courseInfo) {
      return request({
        url: `/eduservice/course/addCourseInfo`,
        method: 'post',
        data: courseInfo
      })
    },
    //查询所有讲师
    getTeacher() {
        return request({
            url: `/eduservice/edu-teacher/findAll`,
            method: 'get'
        })
    },
    //根据课程id查询课程基本信息
    getCourseInfo(courseId) {
      return request({
          url: `/eduservice/course/getCourseInfo/${courseId}`,
          method: 'get'
      })
    },
    //修改课程
    updateCourseInfo(courseInfo) {
      return request({
        url: `/eduservice/course/updateCourseInfo`,
        method: 'post',
        data: courseInfo
      })
    },

    //课程确认信息显示
    getCoursePublish(courseId){
      return request({
        url: `/eduservice/course/getCoursePublish/${courseId}`,
        method: 'get'
      })
    },

    //课程最终发布
    publishCourse(courseId) {
      return request({
        url: `/eduservice/course/publishCourse/${courseId}`,
        method: 'patch'
      })
    },

    //获取课程列表, 带模糊查询, get请求带参数
    getPageList(page, limit, searchObj) {
      return request({
        url: `/eduservice/course/pageQuery/${page}/${limit}`,
        method: 'get',
        params: searchObj
      })
    }
}
