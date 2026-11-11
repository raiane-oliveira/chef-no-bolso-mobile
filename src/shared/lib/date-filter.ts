// Antes duplicado em orders.tsx e deliveries.tsx
export function filterByDateRange<T extends { createdAt: string }>(
  items: T[],
  startDate: string,
  endDate: string,
) {
  if (!startDate && !endDate) return items

  const start = startDate ? new Date(startDate) : null
  const end = endDate ? new Date(endDate + 'T23:59:59') : null

  return items.filter((item) => {
    const date = new Date(item.createdAt)
    if (start && date < start) return false
    if (end && date > end) return false
    return true
  })
}
