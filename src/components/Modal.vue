<template lang="html">
  <!--通用的 模态框  弹框  -->
  <div class="">
    <div class="md-modal modal-msg md-modal-transition " v-bind:class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <!-- <div class="md-title">Login in</div> -->
          <button class="md-close" @click="closeModal">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <!--插槽  提示信息  -->
            <slot name="message"></slot>
            <!-- <div class="error-wrap">
              <span class="error error-show" v-show="errorTip">用户名或者密码错误</span>
            </div>
            <ul>
              <li class="regi_form_input">
                <i class="icon IconPeople"></i>
                <input type="text" tabindex="1" name="loginname" v-model="userName"  class="regi_login_input regi_login_input_left" placeholder="User Name" data-type="loginname">
              </li>
              <li class="regi_form_input noMargin">
                <i class="icon IconPwd"></i>
                <input type="password" tabindex="2"  name="password"  v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password" >
              </li>
            </ul> -->
          </div>
          <!-- <div class="login-wrap"> -->
          <div class="btn-wrap" >
           <!--插槽 自定义按钮  -->
            <slot name="btnGroup"></slot>
            <!-- <a href="javascript:;" class="btn-login" @click="login">登  录</a> -->
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="mdShow" @click="closeModal"> </div>
  </div>
</template>

<script>
export default {
  props:["mdShow"],   //接受 父级 传递信息
  data (){
    return {

    }
  },
  methods:{
    closeModal (){
      this.$emit('close')
    }
  }
}
</script>

<style lang="css">
</style>
