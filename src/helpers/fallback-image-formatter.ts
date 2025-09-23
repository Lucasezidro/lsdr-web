export function fallbackImageFormatter(name: string) {
  if (!name) {
    return ''
  }
  
  const initials = name.split(' ').map(n => n[0]).join('')
  
  return initials.substring(0, 2).toUpperCase()
}