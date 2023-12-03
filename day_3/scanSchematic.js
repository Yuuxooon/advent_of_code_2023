const fs = require('fs')
const readLine = require('readline')

// file to load
const dataStream = fs.createReadStream('./schematic.txt')

const rl = readLine.createInterface({
  input: dataStream,
  crlfDelay: Infinity
})

// part switcher
const partTwo = true
// part 2 vars
let gearRatioSum = 0
// stores all symbols that aree not numbers or
const symbolSet = []
// create 2d array as data structure
const schematic = []
// storage for the solution
let numSum = 0
let numSumNoSymbol = 0
let NumSumAtWall = 0

// vars for parsing logic
const numSumArr = []
let anomalyCount = 0
const allCharSet = []
let allNumSum = 0
let totalNumbers = 0
let totalNumbersWithSymbol = 0
let totalNumbersWithoutSymbol = 0
let numSeq = []
let numSeqCoords = []
let maxBoundary = {
  xMax: 0,
  yMax: 0
}

const isNumber = char => {
  return !Number.isNaN(parseInt(char))
}

// takes array of coords and return true if symbol is present, else false
const hasSymbol = coordArr => {
  for (i in coordArr) {
    if (
      coordArr[i].x >= 0 &&
      coordArr[i].x <= maxBoundary.xMax &&
      coordArr[i].y >= 0 &&
      coordArr[i].y <= maxBoundary.yMax
    ) {
      console.log(
        'checking field: ',
        {
          SYMBOL: schematic[coordArr[i].y][coordArr[i].x]
        },
        ' @ ',
        { x: coordArr[i].x, y: coordArr[i].y }
      )
      if (symbolSet.includes(schematic[coordArr[i].y][coordArr[i].x])) {
        console.log(
          'FOUND: ',
          {
            SYMBOL: schematic[coordArr[i].y][coordArr[i].x]
          },
          ' @ ',
          { x: coordArr[i].x, y: coordArr[i].y }
        )
        return true
      }
    }
  }
  return false
}

const parseNumber = numArray => {
  return parseInt(numArray.join().replaceAll(',', ''))
}

// takes coords for the number sequence and checks for surrounding for symbols, returns true if found else false
const surroundingHasSymbol = coordArr => {
  const lastIndex = coordArr.length - 1
  for (idx = 0; idx < coordArr.length; idx++) {
    if (idx === 0) {
      const { x, y } = coordArr[idx]
      console.log('-----------------------------')
      console.log('First index: ', { x }, { y })
      if (
        hasSymbol([
          { x: x - 1, y: y - 1 },
          { x: x - 1, y: y },
          { x: x - 1, y: y + 1 },
          { x: x, y: y - 1 },
          { x: x, y: y + 1 }
        ])
      ) {
        console.log('FOUND SYMBOL!')
        return true
      }
    }
    if (idx === lastIndex) {
      const { x, y } = coordArr[idx]
      console.log('Last index: ', { x }, { y })
      if (
        hasSymbol([
          { x: x + 1, y: y - 1 },
          { x: x + 1, y: y },
          { x: x + 1, y: y + 1 },
          { x: x, y: y - 1 },
          { x: x, y: y + 1 }
        ])
      ) {
        console.log('FOUND SYMBOL!')
        return true
      }
    }
    const { x, y } = coordArr[idx]
    console.log('Middle index: ', { x }, { y })
    if (
      hasSymbol([
        { x: x, y: y - 1 },
        { x: x, y: y + 1 }
      ])
    ) {
      console.log('FOUND SYMBOL!')
      return true
    }
  }
  console.log('FAILED!')
  return false
}

const parseSchematic = () => {
  schematic.map((row, iY) => {
    row.map((element, iX) => {
      // is number?
      if (!isNaN(parseInt(element))) {
        // is number
        numSeq.push(parseInt(element))
        numSeqCoords.push({
          x: iX,
          y: iY
        })

        if (iY === maxBoundary.yMax && iX === maxBoundary.xMax) {
          anomalyCount++
          // parser reached end of file while on a number, checking it!
          num = parseNumber(numSeq)
          if (surroundingHasSymbol(numSeqCoords)) {
            // has symbol
            numSumArr.push(num)
            numSum += num
            totalNumbersWithSymbol++
            console.log(
              'Number has symbol: ',
              { numSeq, numSeqCoords, num },
              '#'
            )
          } else {
            // has no symbol
            numSumNoSymbol += num
            totalNumbersWithoutSymbol++
            console.log(
              'Number has no symbol: ',
              { numSeq, numSeqCoords, num },
              'X'
            )
          }
          allNumSum += num
          totalNumbers++
          numSeq = []
          numSeqCoords = []
        }
      } else {
        // is not a number
        if (numSeq.length != 0) {
          // sequenc contains entries while on a non number element, parse number and check for symbols, then reset buffers
          num = parseNumber(numSeq)
          if (surroundingHasSymbol(numSeqCoords)) {
            // has symbol
            numSumArr.push(num)
            numSum += num
            totalNumbersWithSymbol++
            console.log(
              'Number has symbol: ',
              { numSeq, numSeqCoords, num },
              '#'
            )
          } else {
            // has no symbol
            numSumNoSymbol += num
            totalNumbersWithoutSymbol++
            console.log(
              'Number has no symbol: ',
              { numSeq, numSeqCoords, num },
              'X'
            )
          }
          allNumSum += num
          totalNumbers++
          numSeq = []
          numSeqCoords = []
        }
      }
    })
  })
}

const numFromCoord = ({ x, y }) => {
  let cX = x
  let cY = y
  const numReg = []
  let checking = true
  let checkLeft = true
  while (checkLeft) {
    cX--
    if (!isNumber(schematic[cY][cX]) || cX < 0) {
      checkLeft = false
      break
    }
  }
  while (checking) {
    numReg.push(parseInt(schematic[cY][cX]))
    cX++
    if (!isNumber(schematic[cY][cX]) || cX > maxBoundary.xMax) {
      checking = false
      break
    }
  }
  numReg.shift()
  console.log('This is the numReg: ', { numReg })
  return parseNumber(numReg)
}

const checkAdjacentNums = coordArr => {
  const numCollection = []
  for (i in coordArr) {
    const { x, y } = coordArr[i]
    if (isNumber(schematic[y][x])) {
      numCollection.push(numFromCoord({ x, y }))
    }
  }
  numCollectionUnique = [...new Set(numCollection)]
  console.log('This is the current num collection: ', numCollectionUnique)
  if (numCollectionUnique.length === 2) {
    const [a, b] = numCollectionUnique
    console.log('FOUND CANDIDATE: ', a, b, ' -> ', a * b)
    gearRatioSum += a * b
  } else {
    console.log('FAILED!')
  }
}

const produceSurroundingSearchArr = ({ x, y }) => {
  return [
    { x: x - 1, y: y - 1 },
    { x: x - 1, y: y },
    { x: x - 1, y: y + 1 },
    { x: x, y: y - 1 },
    { x: x, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y: y },
    { x: x + 1, y: y + 1 }
  ]
}

const findGear = () => {
  schematic.map((row, iY) => {
    row.map((element, iX) => {
      if (element === '*') {
        console.log('<*> has been found @ ', { iX, iY }, ' checking...')
        checkAdjacentNums(produceSurroundingSearchArr({ x: iX, y: iY }))
      }
    })
  })
}

// analyse and load the schematic
rl.on('line', line => {
  const lineBuffer = []
  line.split('').map(char => {
    lineBuffer.push(char)
    if (!allCharSet.includes(char)) {
      allCharSet.push(char)
    }

    if (char !== '.' && !isNumber(char) && !symbolSet.includes(char)) {
      symbolSet.push(char)
    }
  })
  schematic.push(lineBuffer)
})

const extractSumFromArr = arr => {
  let num = 0
  for (i in arr) {
    num += arr[i]
  }
  return num
}

rl.on('close', () => {
  maxBoundary = {
    xMax: schematic[0].length - 1,
    yMax: schematic.length - 1
  }
  if (partTwo) {
    findGear()
  } else {
    parseSchematic()
  }

  const data = extractSumFromArr(numSumArr)
  console.log({ data })
  console.log('Finished!')
  console.log('All unique chars found: ', allCharSet.sort())
  console.log('Unique Symbols found: ', symbolSet, maxBoundary)
  console.log(
    { totalNumbersWithSymbol },
    { totalNumbersWithoutSymbol },
    { totalNumbers },
    totalNumbersWithSymbol + totalNumbersWithoutSymbol === totalNumbers
  )
  console.log('Sum of numbers with symbol: ', numSum)
  console.log(
    { numSum },
    { numSumNoSymbol },
    { allNumSum },
    numSum + numSumNoSymbol === allNumSum
  )
  console.log({ anomalyCount }, { gearRatioSum })
})
