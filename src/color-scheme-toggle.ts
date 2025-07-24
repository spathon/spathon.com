/**
 * Dark mode toggle
 */
export function initColorSchemeToggle(
  isDefaultDark: boolean,
  changeCallback?: (isDarkMode: boolean) => void,
) {
  // Check if color scheme is set in localStorage
  // If not, check system preference
  // Default to dark mode if no preference is set
  const $darkModeToggle = document.getElementById('darkModeToggle')
  const $body = document.body
  let isDarkMode = isDefaultDark
  if ($darkModeToggle) {
    $body.classList.add(isDefaultDark ? 'moon' : 'sun')
    $darkModeToggle.addEventListener('click', () => {
      // Set dark
      if (!isDarkMode) {
        $body.classList.add('moon')
        $body.classList.remove('sun')
        localStorage.setItem('colorScheme', 'dark')
        isDarkMode = true
        // Set light
      } else {
        $body.classList.add('sun')
        $body.classList.remove('moon')
        localStorage.setItem('colorScheme', 'light')
        isDarkMode = false
      }
      changeCallback?.(isDarkMode)
    })
  }
}
