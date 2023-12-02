const fs = require('fs')
const readLine = require('readline')

const dataStream = fs.createReadStream('./input.txt')

// available cubes
const cubes = {
  red: 12,
  green: 13,
  blue: 14
}
// sum of IDs of possible games
let idSum = 0
// power accumulator
let powerSum = 0

const rl = readLine.createInterface({
  input: dataStream,
  crlfDelay: Infinity
})

console.log('START <<<-------------------------------------------->>>')

// parse line
rl.on('line', line => {
  // check each game -----------------------
  const collonSplit = line.split(':')
  const gameIdInt = parseInt(collonSplit[0].split(' ')[1])

  let hRed = 0
  let hGreen = 0
  let hBlue = 0
  // possibility state
  let whichFailed = ''
  let isPossible = true
  console.log(collonSplit[0], { gameIdInt })
  // check sets
  collonSplit[1].split(';').map(set => {
    console.log('-', set)
    set.split(',').map(entry => {
      const element = entry.split(' ')
      switch (element[2]) {
        case 'red':
          const numRed = parseInt(element[1], 10)
          if (numRed > hRed) {
            hRed = numRed
          }
          if (isPossible) {
            console.log('red   ', numRed)
            isPossible = numRed <= cubes.red
            if (!isPossible) {
              whichFailed = 'RED'
              console.error(
                '\x1b[31m%s\x1b[0m',
                'Failed! ',
                { numRed },
                ' > ',
                { red: cubes.red }
              )
            }
          }
          break
        case 'green':
          const numGreen = parseInt(element[1], 10)
          if (numGreen > hGreen) {
            hGreen = numGreen
          }
          if (isPossible) {
            console.log('green ', numGreen)
            isPossible = numGreen <= cubes.green
            if (!isPossible) {
              whichFailed = 'GREEN'
              console.error(
                '\x1b[31m%s\x1b[0m',
                'Failed!',
                { numGreen },
                ' > ',
                { green: cubes.green }
              )
            }
          }
          break
        case 'blue':
          const numBlue = parseInt(element[1], 10)
          if (numBlue > hBlue) {
            hBlue = numBlue
          }
          if (isPossible) {
            console.log('blue  ', numBlue)
            isPossible = numBlue <= cubes.blue
            if (!isPossible) {
              whichFailed = 'RED'
              console.error(
                '\x1b[31m%s\x1b[0m',
                'Failed!',
                { numBlue },
                ' > ',
                { blue: cubes.blue }
              )
            }
          }
          break
        default:
          break
      }
    })
  })

  // sets are finished, evaluate game

  if (isPossible) {
    idSum = idSum + gameIdInt
    console.log('PASS', { idSum })
  }

  console.log(
    'is game possible: ',
    isPossible,
    isPossible ? '' : ` ${whichFailed} failed `,
    ' Game Id: ',
    gameIdInt
  )

  // evaluate power
  powerSum = powerSum + hRed * hGreen * hBlue
  console.log('\x1b[100m\x1b[36m%s\x1b[0m', 'Lowest cube configuration is: ', {
    hRed,
    hGreen,
    hBlue
  })
  console.log('--------------------------------------------')
})

// finished
rl.on('close', () => {
  console.log(
    '\x1b[5m\x1b[47m\x1b[30m%s\x1b[0m',
    'FINISHED! The sum of IDs is: ',
    { idSum }
  )
  console.log('\x1b[40m\x1b[37m%s\x1b[0m', 'The accumulated power is: ', {
    powerSum
  })
})
