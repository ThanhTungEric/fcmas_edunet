export function useDemo18RadialBar() {
  const themeColors = useThemeColors()
  const series = shallowRef<any[]>([])

  watchEffect(() => {
    series.value = [70]
  })

  return reactive({
    height: 295,
    type: 'radialBar',
    series,
    options: {
      title: {
        text: 'Radial Bar',
      },
      chart: {
        toolbar: {
          show: false,
        },
      },
      colors: [
        themeColors.purple,
        themeColors.info,
        themeColors.lime,
        themeColors.purple,
        themeColors.orange,
      ],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
          },
        },
      },
      labels: ['Power'],
    },
  })
}
