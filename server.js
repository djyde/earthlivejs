var request = require('request')
  , Canvas = require('canvas')
  , async = require('async')
  , fs = require('fs')
  , moment = require('moment')
  , path = require('path')
  , format = require('util').format

var SIZE = 550
  , SPLITS = 4

var URL = 'http://himawari8-dl.nict.go.jp/himawari8/img/D531106/%sd/%s/%s_%s_%s.png'

var PATH = path.join(__dirname, 'images')

try {
  fs.accessSync(PATH)
} catch (e) {
  fs.mkdirSync(PATH)
}

function get (time, x, y, callback) {
  var url = format(URL, SPLITS, SIZE, time.format('YYYY/MM/DD/HHmmss'), x, y)
  return request.get(url, { encoding: null }, function (err, res, body) {
    callback(err, body)
  })
}

function createImage(buffer) {
  var image = new Canvas.Image
  image.src = buffer
  return image
}

function fetch () {
  var time = moment()
  time.subtract(30, 'minutes')
  time.subtract(time.utcOffset(), 'minutes')
  time.subtract(time.minute() % 10, 'minutes')
  time.second(0)

  var requests = []

  for (var x = 0; x < SPLITS; x++) {
    for (var y = 0; y < SPLITS; y++) {
      requests.push(async.apply(get, time, x, y))
    }
  }

  async.parallel(requests, function (err, results) {
    if (err) {
      console.error('failed to fetch images', err)
      return
    }

    var canvas = new Canvas(SIZE * SPLITS, SIZE * SPLITS)
      , ctx = canvas.getContext('2d')

    for (var x = 0; x < SPLITS; x++) {
      for (var y = 0; y < SPLITS; y++) {
        ctx.drawImage(createImage(results.shift()), x * SIZE, y * SIZE, SIZE, SIZE)
      }
    }

    var output = format('%s.png', +new Date())

    console.log('done fetching %s, saved as %s', time.format('YYYY/MM/DD/HH:mm:ss'), output)

    canvas.createPNGStream().pipe(fs.createWriteStream(path.join(PATH, output)))
  })

}

setInterval(function () {
  fetch()
  var clean = moment().subtract(10, 'minutes')

  fs.readdirSync(PATH).forEach(function (file) {
    if ('.png' != path.extname(file)) {
      return
    }

    var time = parseInt(path.basename(file, '.png'))

    if (isNaN(time)) {
      return
    }

    time = moment(time)

    if (time.isAfter(clean)) {
      return
    }

    fs.unlinkSync(path.join(PATH, file))

    console.log('cleaned file %s fetched %s', file, time.fromNow())
  })
}, moment.duration(5, 'minutes').as('milliseconds'))

fetch()
