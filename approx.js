var BUCKET_COUNT = 1000
var GENERATIONS = 10
var SAMPLE_COUNT = BUCKET_COUNT*10000

var buckets = new Array(BUCKET_COUNT)
var bucketDivs

function createQuarticSample() {
  var sample = Math.random() * BUCKET_COUNT * BUCKET_COUNT * BUCKET_COUNT * BUCKET_COUNT
  return Math.sqrt(Math.sqrt(sample))
}

function createSquareSample() {
  var sample = Math.random() * BUCKET_COUNT * BUCKET_COUNT
  return Math.sqrt(sample)
}

function createSqrtSample() {
  var sample = Math.random() * Math.sqrt(BUCKET_COUNT)
  return sample * sample
}

for (var i = 0; i < BUCKET_COUNT; i++) {
  buckets[i] = {
    width: 1,
    start: i,
    count: 0
  }
}

function incrementBucket(buckets, sample, start, end) {
  if (end - start <= 1) {
    if (buckets[end].start > sample) {
      return buckets[start].count++
    }
    return buckets[end].count++
  }
  var middle = Math.ceil((end - start) / 2)
  var middleBucket = buckets[start + middle]
  if (middleBucket.start > sample) {
    incrementBucket(buckets, sample, start, start + middle)
  } else {
    incrementBucket(buckets, sample, start + middle, end)
  }
}

for (var k = 0; k < GENERATIONS; k++) {
  for (var i = 0; i < SAMPLE_COUNT; i++) {
    var sample = createQuarticSample()
    //var sample = createSquareSample()
    //var sample = createSqrtSample()
    incrementBucket(buckets, sample, 0, buckets.length - 1)
  }
  var timeTotal = 0
  var sampleTotal = 0
  var average = SAMPLE_COUNT/BUCKET_COUNT
  for (var i = 0; i < BUCKET_COUNT; i++) {
    var bucket = buckets[i]
    if (bucket.count > average) {
      sampleTotal += bucket.count - average
      var oldWidth = bucket.width
      bucket.width = bucket.width * average / bucket.count
      timeTotal += oldWidth - bucket.width
    }
  }
  var timePerSample = timeTotal/sampleTotal
  for (var i = 0; i < BUCKET_COUNT; i++) {
    var bucket = buckets[i]
    if (bucket.count < average) {
      bucket.width += (average - bucket.count) * timePerSample
    }
  }

  var totalToPoint = 0
  for (var i = 0; i < BUCKET_COUNT; i++) {
    buckets[i].start = totalToPoint
    totalToPoint += buckets[i].width
    buckets[i].count = 0
  }
}

var x = 0
for (var i = 0; i < BUCKET_COUNT; i++) {
  x += buckets[i].width
}


window.onload = function() {
  chart = new Chart($('#myChart'), {
    type: 'line',
    data: {
      datasets: [{
        label: '1/bucket width',
        data: buckets.map((e, i) => {
          return {x: e.start, y: 1/e.width}
        })
      }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
  })
  console.log(buckets.map((e) => e.width))
}
