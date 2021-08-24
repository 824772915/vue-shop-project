<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="getRolesList">
            <el-button slot="append" icon="el-icon-search" @click="getRoles"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true" >添加角色</el-button>
        </el-col>
      </el-row> 
      <el-table :data="rolelist" border stripe>
      <!-- 展开列 type="expand"使得可以展开 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>
              {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

     <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules2" ref="addFormRef2" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles" >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <!-- 内容主体区域 -->
      <el-form :model="editRoleForm" :rules="addFormRules2" ref="editFormRef2" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo" >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件  show-checkbox复选框  default-expand-all默认展开 default-checked-keys默认勾选属性-->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList,putRoles,addRoles,getRoles,deleteRoles,deleteRolesRights,getRightsTree,allotRights} from "../../network/home";
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      // 添加用户弹出对话框
      addDialogVisible:false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
       addFormRules2: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名称的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '角色描述的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 查询参数 id
      query:'',
      // 是否显示修改框
      editDialogVisible:false,
      // 查询到的用户信息对象
      editRoleForm: {},

    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    // 获取角色列表
    getRolesList(){
      getRolesList().then(res =>{
        // console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('获取角色列表失败！')
        }else{
          this.rolelist = res.data;
          // console.log(this.rolelist);
        }
      })
    },
    // 对角色列表进行编辑操作
    showEditDialog(id){
      this.editDialogVisible = true
      getRoles(id).then(res => {
        // console.log(res);
        if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }else{
        this.editRoleForm = res.data
      }
      })
    },
    // 修改用户的时候对表单保存且验证
    editUserInfo(){
      this.$refs.editFormRef2.validate(async valid => {
      if (!valid) return
      // 发起修改用户信息的数据请求
      putRoles(this.editRoleForm.roleId,this.editRoleForm.roleName,this.editRoleForm.roleDesc).then(res =>{
        if (res.meta.status !== 200) {
        return this.$message.error('更新用户信息失败！')
      }else{
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getRolesList()
        // 提示修改成功
        this.$message.success('更新角色信息成功！')
      }
      })
    })
    },
    // 添加角色对话框的关闭事件
    addDialogClose(){
      // this.$refs.addFormRef2.resetFields();
      this.$refs.addFormRef2.resetFields();
    },
    // 添加角色
    addRoles(){
      addRoles(this.addForm.roleName,this.addForm.roleDesc).then(res =>{
        if(res.meta.status !== 201){
                return this.$message.error(res.meta.msg)
             }else{
                this.$message.success(res.meta.msg)
                // 隐藏添加用户的对话框
                this.addDialogVisible = false
                // 重新获取用户列表数据
                this.getRolesList()
            }
      })
    },
    // 查询角色
    getRoles(){
      getRoles(this.query).then(res => {
        console.log(res);
        if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }else{
        return this.$message.success('第'+res.data.roleId+'号角色：'+res.data.roleName+'——'+res.data.roleDesc)
      }
      })
    },
    // 关闭编辑对话框
    editDialogClose(){
      this.$refs.editFormRef2.resetFields();
    },
    // 删除用户操作
    async removeUserById(id){
      // console.log(id);
      // 发送删除用户请求
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirmResult);
      if(confirmResult !== 'confirm'){
        return this.$message.info('删除操作')
      }else{
        deleteRoles(id).then(res =>{
            if (res.meta.status !== 200) {
               return this.$message.error('删除角色失败！')
             }else{
               this.$message.success('删除角色成功！')
               this.getRolesList()
             }
        })
      }
    },
    // 删除对应的权限
    async removeRightById(role, rightId){
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }else{
        // 发送删除权限请求
        deleteRolesRights(role.id,rightId).then(res =>{
          if (res.meta.status !== 200) {
            return this.$message.error('删除权限失败！')
          }else{
            role.children = res.data
          }
        })
      }


    },
    // 展示分配权限对话框
    showSetRightDialog(role){
     
      this.roleId = role.id
      // 获取所有权限的数据
      getRightsTree().then(res =>{
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限数据失败！')
        }else{
          // 把获取到的权限数据保存到 data 中
          this.rightslist = res.data
          console.log(this.rightslist)
        }
      })
      this.setRightDialogVisible = true;
      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
     // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    //点击确认后 角色授权发送到后台保存
    allotRights(){
      // element提供的方法 获取选中节点和半选中节点的按钮
      const keys = [
        // 。。。展开运算符 
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys);
      const idStr = keys.join(',')
      // console.log(idStr);
      allotRights(this.roleId,idStr).then(res =>{
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }else{
          this.$message.success('分配权限成功！')
          this.getRolesList()
          this.setRightDialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>

