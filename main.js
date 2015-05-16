var fs = require('fs')

var adsb = require('./lib/adsb.js')

var decoded_messages = []

var filenames = [
  'adsbox_messages.dat',
  'adsbox_messages_colinear.dat',
  'adsbox_messages_colinear2.dat',
  'adsbox_messages_colinear3.dat',
  'adsbox_messages_colinear4.dat',
  'adsbox_messages_colinear6.dat',
  'adsbox_messages_colinear7.dat',
  'adsbox_messages_colinear8.dat',
  'adsbox_messages_colinear9.dat',
  'adsbox_messages_colinear10.dat',
]

filenames.forEach(function(name){
  decode_file(name)
})

console.log(Object.keys(decoded_messages[0]))

var fields = Object.keys(decoded_messages[0])

var written_data = {
  fields: fields,
  data: []
}

decoded_messages.forEach(function(msg){
  var d = []
  fields.forEach(function(field){
    d.push(msg[field])
  })
  written_data.data.push(d)
})

console.log()

fs.writeFile('output.json', JSON.stringify(written_data,null,0))



function decode_file(filename){

  var file_lines = fs.readFileSync(__dirname+'/adsb_data/'+filename).toString()

  // console.log(file_lines.length)
  // console.log(typeof file_lines)

  var split_lines = file_lines.split('\r\n')
  split_lines = split_lines.filter(function(e){return e.length > 0})

  // console.log(split_lines.length)

  split_lines.forEach(function(line){

    var line = line.split(' ')

    var decoded_packet = adsb.decodePacket(line[2])

    decoded_packet.metadata = line

    console.log(decoded_packet.altitude)


    // console.log(line,adsb.decodePacket(line[2]))
    decoded_messages.push(decoded_packet)

  })
}
