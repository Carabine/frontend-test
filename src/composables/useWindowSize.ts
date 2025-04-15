import { computed, onMounted, onUnmounted, ref } from 'vue'

export enum WindowSize {
  Lg = 'lg',
  Md = 'md',
  Xs = 'xs'
}

export const useWindowSize = () => {
  const windowWidth = ref(window.innerWidth)

  const onWidthChange = () => (windowWidth.value = window.innerWidth)
  onMounted(() => window.addEventListener('resize', onWidthChange))
  onUnmounted(() => window.removeEventListener('resize', onWidthChange))

  const windowSize= computed(() => {
    if (windowWidth.value < 550) return WindowSize.Xs
    if (windowWidth.value >= 550 && windowWidth.value < 1200) return WindowSize.Md
    else return WindowSize.Lg // Fires when windowWidth.value >= 1200
  })

  const width = computed(() => windowWidth.value)

  return { width, windowSize }
}
