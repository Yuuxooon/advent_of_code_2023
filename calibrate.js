const fs = require('fs')
const readLine = require('readline')

const dataStream = fs.createReadStream('./data.txt')

const rl = readLine.createInterface({
  input: dataStream,
  crlfDelay: Infinity
})

const lineValues = []
let lineIndex = -1
let lineValueSum = 0

// toggle between solution 1 and 2
const enableSecondSolution = true

// parse the lines
rl.on('line', line => {
  lineIndex++
  console.log(lineIndex, line)
  const numArray = []

  let wordBuffer = ''

  // extract and cast numbers in order onto an array
  line.split('').map((char, idx) => {
    if (char >= '0' && char <= '9') {
      numArray.push(Number(char))
      wordBuffer = wordBuffer.concat('_')
    } else {
      wordBuffer = wordBuffer.concat(char)
    }

    if (enableSecondSolution) {
      if (wordBuffer.includes('one')) {
        numArray.push(1)
        wordBuffer = wordBuffer.replaceAll('o', '-')
      }
      if (wordBuffer.includes('two')) {
        numArray.push(2)
        wordBuffer = wordBuffer.replaceAll('t', '-')
      }
      if (wordBuffer.includes('three')) {
        numArray.push(3)
        wordBuffer = wordBuffer.replaceAll('t', '-')
      }
      if (wordBuffer.includes('four')) {
        numArray.push(4)
        wordBuffer = wordBuffer.replaceAll('f', '-')
      }
      if (wordBuffer.includes('five')) {
        numArray.push(5)
        wordBuffer = wordBuffer.replaceAll('f', '-')
      }
      if (wordBuffer.includes('six')) {
        numArray.push(6)
        wordBuffer = wordBuffer.replaceAll('s', '-')
      }
      if (wordBuffer.includes('seven')) {
        numArray.push(7)
        wordBuffer = wordBuffer.replaceAll('s', '-')
      }
      if (wordBuffer.includes('eight')) {
        numArray.push(8)
        wordBuffer = wordBuffer.replaceAll('e', '-')
      }
      if (wordBuffer.includes('nine')) {
        numArray.push(9)
        wordBuffer = wordBuffer.replaceAll('n', '-')
      }
    }

    console.log('rest: ', wordBuffer)
  })

  console.log(numArray)

  // concat first and last digit
  if (numArray) {
    if (numArray.length === 1) {
      lineValues.push(numArray[0] * 10 + numArray[0])
      console.log('Value: ', numArray[0] * 10 + numArray[0])
    } else {
      lineValues.push(numArray[0] * 10 + numArray[numArray.length - 1])
      console.log('Value: ', numArray[0] * 10 + numArray[numArray.length - 1])
    }
  }
})

// when parsing is finished
rl.on('close', () => {
  console.log(lineValues)
  console.log(`Finished! Total lines: ${lineIndex + 1}`)
  lineValues.forEach(val => {
    lineValueSum = lineValueSum + val
  })
  console.log(
    'This is the ',
    enableSecondSolution ? 'second solution.' : 'first solution.'
  )
  console.log(`The sum of all line values is: ${lineValueSum}`)
})
