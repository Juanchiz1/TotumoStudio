import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource-variable/jetbrains-mono'
import './scss/main.scss'
import { initNav } from './js/nav.js'
import { initHero } from './js/hero.js'
import { initServices } from './js/services.js'
import { initQuote } from './js/quote/quote.js'
import { initProjects } from './js/projects.js'

initNav()
initHero()
initServices()
initQuote()
initProjects()