<template lang="html">
  <div class="nav-breadcrumb-wrap">
    <div class="container">
      <nav class="nav-breadcrumb">
        <a href="/">Home</a>
        <!-- <span>Goods</span> -->
        <slot name="bread"></slot>
        <slot name="b"></slot>
        <!--slot 插槽的作用  -->
      </nav>
    </div>
  </div>
</template>
