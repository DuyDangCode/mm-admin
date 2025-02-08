export const randomColorCode = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`

export const getColorWithIndex = (index: number) => {
  const highContrastColors = [
    '#FF0000',
    '#0000FF',
    '#00FF00',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#800000',
    '#808000',
    '#008080',
    '#000080',
    '#FFA500',
    '#800080',
    '#A52A2A',
    '#DC143C',
    '#FFD700',
  ]
  return highContrastColors[
    index >= highContrastColors.length
      ? index % highContrastColors.length
      : index
  ]
}
