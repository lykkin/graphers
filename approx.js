var BUCKET_COUNT = 100
var GENERATIONS = 10
var SAMPLE_COUNT = BUCKET_COUNT*1000

var buckets = new Array(BUCKET_COUNT)
var bucketDivs

for (var i = 0; i < BUCKET_COUNT; i++) {
  buckets[i] = {
    width: 1,
    count: 0
  }
}

for (var k = 0; k < GENERATIONS; k++) {
  for (var i = 0; i < SAMPLE_COUNT; i++) {
  var s = Math.random() * Math.sqrt(BUCKET_COUNT);
  var sample = s * s
	for (var j = 0; j < BUCKET_COUNT; j++) {
	  sample -= buckets[j].width
	  if (sample <= 0) {
		buckets[j].count++
		break
	  }
	}	
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
  
  for (var i = 0; i < BUCKET_COUNT; i++) {
    buckets[i].count = 0
  }
}

var x = 0
for (var i = 0; i < BUCKET_COUNT; i++) {
  x += buckets[i].width
}

window.onload = function() {
  var container = $('#container')
  var MAX_WIDTH = 1000
  var MAX_HEIGHT = 100
  var start = 0
  var totalWidth = buckets.reduce(function (a, e) { return a + e.width }, 0)
  bucketDivs = buckets.map(function(e, i) {
    console.log(start, start + e.width / totalWidth)
    var div = $("<div>", {
      class: 'bar',
      style: produceStyle(
        Math.ceil(start * MAX_WIDTH), //left side
        Math.ceil((start + e.width / totalWidth) * MAX_WIDTH), //right side
        Math.ceil((SAMPLE_COUNT / BUCKET_COUNT) / (10 * e.width) ) //height
      )
    });
    start += e.width/totalWidth
    return div
  })
  console.log(buckets.map(function (a) {return a.width}))
  container.append(bucketDivs)
}

function produceStyle(horiStart, horiEnd, vert) {
  return [
    "grid-row: 1 / " + (vert + 1),
    "grid-column: " + (horiStart + 1) + " / " + (horiEnd + 1)
  ].join(';')
}
