export const utilService = {
  makeId,
  getRandomIntInclusive,
  debounce,
  saveToStorage,
  loadFromStorage,
  capitalize,
  getLastFourMonths,
  getFormattedCurrency,
  greetBasedOnHour,
  animateCSS,
}

function makeId(length = 6) {
  var txt = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return txt
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : undefined
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getLastFourMonths() {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const currentMonthIndex = new Date().getMonth()

  const lastFourMonthIndexes = [
    (currentMonthIndex - 3 + 12) % 12,
    (currentMonthIndex - 2 + 12) % 12,
    (currentMonthIndex - 1 + 12) % 12,
    currentMonthIndex,
  ]

  const lastFourMonthsObject = {}

  lastFourMonthIndexes.forEach(index => {
    const monthName = months[index]
    lastFourMonthsObject[monthName] = 0
  })

  return lastFourMonthsObject
}

function getFormattedCurrency(amount) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ILS',
  }).format(amount)

  return formattedAmount
}

function greetBasedOnHour() {
  const currentHour = new Date().getHours()

  if (currentHour >= 6 && currentHour < 12) {
    return 'Good morning'
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good afternoon'
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'Good evening'
  } else {
    return 'Good night'
  }
}

function animateCSS(el, animation = 'bounce') {
  const prefix = 'animate__'
  return new Promise(resolve => {
    const animationName = `${prefix}${animation}`
    el.classList.add(`${prefix}animated`, animationName)

    el.addEventListener('animationend', handleAnimationEnd, { once: true })

    function handleAnimationEnd(event) {
      event.stopPropagation()
      resolve('Animation ended')
    }
  })
}
