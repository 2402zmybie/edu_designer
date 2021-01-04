import request from '@/utils/request'

export default {
    //获得树形课程分类
    getAllSubject() {
      return request({
        url: `/eduservice/edu-subject/getAllSubject`,
        method: 'get'
      })
    }
}
