<script setup lang="ts">
import { ref } from 'vue'

import { useWindowSize, WindowSize } from '@/composables/useWindowSize';
import CreatePlaceForm from '@/pages/places/CreatePlaceForm.vue';
import Filters from '@/pages/places/Filters.vue';

const showFiltersModal = ref(false)

const { windowSize } = useWindowSize()

</script>

<template>
  <div class="side-panel-wrapper">
    <el-button
      v-if="windowSize === WindowSize.Xs || windowSize === WindowSize.Md"
      @click="showFiltersModal = true"
      type="primary"
    >
      Відкрити меню
    </el-button>

    <el-dialog
      v-if="windowSize === WindowSize.Xs || windowSize === WindowSize.Md"
      v-model="showFiltersModal"
      title="Меню"
      width="90%"
      :close-on-click-modal="true"
    >
      <el-row :gutter="20">
        <Filters />
        <CreatePlaceForm />
      </el-row>
    </el-dialog>

    <el-card v-else class="side-panel" shadow="hover">
      <el-row :gutter="20">
        <Filters />
        <CreatePlaceForm />
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
.side-panel-wrapper {
  height: 100%;
}

.side-panel {
  padding: 8px;
  background-color: #f9fafb;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
