const fs = require('fs')
const readLine = require('readline')

const dataStream = fs.createReadStream('coupons.txt')

const rl = readLine.createInterface({
  input: dataStream,
  crlfDelay: Infinity
})

// vars for part one
const cardCollection = []
let pointSum = 0
// vars for part two
const cardPool = []
let totalAmount = 0
let currentIndex = 0

rl.on('line', line => {
  const couponSegment = line.split(':')
  const numbers = couponSegment[1].split('|')

  cardCollection.push({
    id:
      parseInt(couponSegment[0].trim().replace('  ', '').split(' ')[1]) ||
      parseInt(couponSegment[0].trim().replace(' ', '').split(' ')[1]),
    winningNums: numbers[0]
      .trim()
      .replaceAll('  ', ' ')
      .split(' ')
      .map(x => {
        return parseInt(x)
      }),
    yourNums: numbers[1]
      .trim()
      .replaceAll('  ', ' ')
      .split(' ')
      .map(x => {
        return parseInt(x)
      })
  })
})

const getPoints = ({ winningNums, yourNums }) => {
  let power = -1
  for (i in yourNums) {
    const num = yourNums[i]
    if (winningNums.includes(num)) {
      power++
    }
  }
  return power !== -1 ? 2 ** power : 0
}

const getCardsBasedOnScore = ({ id, multiplier }, score) => {
  const idBucket = []
  for (i = id; i < id + score; i++) {
    cardPool[i].multiplier += multiplier
    idBucket.push({ id: cardPool[i].id, multiplierAdd: multiplier })
  }
  console.log('Future IDs: ', idBucket)
}

const getCardScore = ({ winningNums, yourNums }) => {
  let score = 0
  for (i in yourNums) {
    const num = yourNums[i]
    if (winningNums.includes(num)) {
      score++
    }
  }
  return score
}

const startCouponGathering = () => {
  // load card collection
  cardPool.push(
    ...cardCollection.map(card => {
      return { ...card, multiplier: 1 }
    })
  )

  console.log(
    '-------------------------------------------------------------------------------------------------'
  )
  currentIndex++
  for (i in cardPool) {
    const currentCard = cardPool[currentIndex - 1]
    totalAmount += currentCard.multiplier
    console.log(
      'CURRENT CARD:   -----> ',
      currentCard.id,
      ' --- multiplier---> ',
      currentCard.multiplier
    )
    const score = getCardScore(currentCard)
    if (score > 0) {
      console.log('<CARD HAS SCORE OF> : ', score)
      getCardsBasedOnScore(currentCard, score)
    } else {
      console.log('<CARD HAS NO SCORE> -------- X')
    }
    console.log(
      '-------------------------------------------------------------------------------------------------',
      totalAmount
    )
    currentIndex++
  }
}

rl.on('close', () => {
  console.log('close')
  for (i in cardCollection) {
    const card = cardCollection[i]
    pointSum += getPoints(card)
    // console.log(card, getPoints(card))
  }
  startCouponGathering()
  //   console.log('TEST ------------> ', cardPool[20])
  console.log('Sum of points accumulated is: ', pointSum)
  console.log({ totalAmount })
})
