<script setup lang="ts">
import { usePlacesStore, PLACE_TYPE_LIST } from '@/store/placesStore'

const store = usePlacesStore()

const onSelectedTypeInputChange = (value: string) => {
  store.setTypeFilter(value)
}

const resetFilter = () => {
  store.resetFilter()
}
</script>

<template>
  <el-col :span="24">
    <h3>Фільтри</h3>
    <el-form
      :inline="false"
      label-position="top"
    >
      <el-form-item label="Тип об'єкта">
        <el-select
          v-model="store.selectedType"
          placeholder="Оберіть тип"
          clearable
          class="filter-select"
          @change="onSelectedTypeInputChange"
        >
          <el-option label="Усі" value="" />
          <el-option v-for="(placeType, index) in PLACE_TYPE_LIST"
                     :key="index" :label="placeType.text" :value="placeType.value" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-col>

  <el-col :span="24">
    <el-button
      @click="resetFilter"
      type="danger"
      class="reset-button"
    >
      Скинути
    </el-button>
  </el-col>
</template>

<style scoped>
.filter-select {
  width: 100%;
}

.reset-button {
  min-width: 130px;
  border-radius: 8px;
}
</style>