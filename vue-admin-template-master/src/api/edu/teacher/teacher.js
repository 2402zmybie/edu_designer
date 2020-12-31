import request from '@/utils/request'

export default {
  // 条件查询 带分页
    getTeacherListPage(current,limit,teacherQuery) {
        return request({
          url: `/eduservice/edu-teacher/pageListTeacherCondition/${current}/${limit}`,
          method: 'post',
          //teacherQuery条件对象, 后端使用RequestBody获取数据
          //data表示把对象转换成json进行传递到接口里面
          data: teacherQuery
        })
      }
}
