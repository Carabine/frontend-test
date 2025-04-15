<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus'

import { usePlacesStore, PLACE_TYPE_LIST, PlaceType } from '@/store/placesStore'
import { getRandomNumber } from '@/utils/helpers';
import { Place } from '@/store/placesStore';

const store = usePlacesStore()

type FormData = {
  name: string,
  type: PlaceType | '',
  coordinates: {
    lat: number | null,
    lng: number | null,
  },
}

const createPlaceForm = reactive<FormData>({
  name: '',
  type: '',
  coordinates: {
    lat: null,
    lng: null,
  },
})

const createPlaceFormRef = ref<FormInstance>()

const rules = {
  name: [{ required: true, message: 'Назва обовʼязкова', trigger: 'blur' }],
  type: [{ required: true, message: 'Оберіть тип', trigger: 'blur' }],
  coordinates: {
    lat: [
      { required: true, message: 'Введіть широту', trigger: 'blur' },
      {
        type: 'number',
        min: -90,
        max: 90,
        message: 'Широта повинна бути між -90 та 90',
        trigger: 'blur'
      }
    ],
    lng: [
      { required: true, message: 'Введіть довготу', trigger: 'blur' },
      {
        type: 'number',
        min: -180,
        max: 180,
        message: 'Довгота повинна бути між -180 та 180',
        trigger: 'blur'
      }
    ],
  }
}

const submitForm = () => {
  createPlaceFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      const place: Place = {
        id: getRandomNumber(100, 10000),
        name: createPlaceForm.name,
        type: createPlaceForm.type as PlaceType,
        coordinates: [
          Number(createPlaceForm.coordinates.lat),
          Number(createPlaceForm.coordinates.lng)
        ],
      }
      store.addPlace(place)
      store.setSelectedPlace(place)
      ElMessage.success('Місце успішно додано!')
      createPlaceForm.name = ''
      createPlaceForm.type = ''
      createPlaceForm.coordinates.lat = null
      createPlaceForm.coordinates.lng = null
    }
  })
}
</script>

<template>
  <el-col :span="24" class="create-place-form-section">
    <h3>Додати нове місце</h3>
    <el-form
      :model="createPlaceForm"
      ref="createPlaceFormRef"
      :rules="rules"
      :inline="false"
      label-position="top"
    >
      <el-form-item label="Назва нового місця" prop="name">
        <el-input
          v-model="createPlaceForm.name"
          placeholder="Введіть назву місця"
        />
      </el-form-item>
      <el-form-item label="Тип нового місця" prop="type">
        <el-select
          v-model="createPlaceForm.type"
          placeholder="Оберіть тип"
          clearable
          class="filter-select"
        >
          <el-option v-for="(placeType, index) in PLACE_TYPE_LIST"
                     :key="index" :label="placeType.text" :value="placeType.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Широта" prop="coordinates.lat">
        <el-input-number
          v-model="createPlaceForm.coordinates.lat"
          placeholder="Введіть широту"
        />
      </el-form-item>
      <el-form-item label="Довгота" prop="coordinates.lng">
        <el-input-number
          v-model="createPlaceForm.coordinates.lng"
          placeholder="Введіть довготу"
        />
      </el-form-item>
      <el-button
        type="primary"
        @click="submitForm"
      >
        Додати місце
      </el-button>
    </el-form>
  </el-col>
</template>
<style scoped>
.create-place-form-section {
  margin-top: 40px;
}

.create-place-form-section h3 {
  margin-bottom: 20px;
}

.el-input-number {
  width: 100%;
}
</style>