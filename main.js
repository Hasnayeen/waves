import Alpine from 'alpinejs'

window.Alpine = Alpine

Alpine.start()

Alpine.data('app', () => ({
  open: false,

  wave(times) {
    console.log('total wave: ' + times)
  }
}))