const fs = require('fs')
const readLine = require('readline')

const dataStream = fs.createReadStream('seeds.txt')

const rl = readLine.createInterface({
  input: dataStream,
  crlfDelay: Infinity
})

// parse buffer
let mapBuffer = {
  sourceName: '',
  targetName: '',
  entries: []
}
let entriesBuffer = []

// vars
const seedCollection = []
const mapCollection = []
const processedSeeds = []
// vars part 2
const setCollection = []
let lowestNum = 0

rl.on('line', line => {
  if (line != '') {
    if (line.includes('seeds')) {
      console.log('Pulling out Seeds!')
      line
        .replace('seeds:', '')
        .trim()
        .split(' ')
        .map(seed => {
          seedCollection.push(parseInt(seed))
        })
    } else {
      if (isNaN(line[0])) {
        if (mapBuffer.targetName != '') {
          console.log(entriesBuffer)
          mapBuffer.entries = entriesBuffer
          mapCollection.push(mapBuffer)

          entriesBuffer = []
          mapBuffer = {}
        }
        const targetName = line.split(' ')[0].split('-')[2]
        const sourceName = line.split(' ')[0].split('-')[0]
        mapBuffer.sourceName = sourceName
        mapBuffer.targetName = targetName
        console.log(sourceName, ' -> ', targetName)
        console.log(mapBuffer)
      } else {
        const nums = line.split(' ').map(e => {
          return parseInt(e)
        })
        entriesBuffer.push({
          source: nums[1],
          target: nums[0],
          range: nums[2]
        })
      }
    }
  }
})

const processSeeds = () => {
  for (iSeed in seedCollection) {
    // looping each seed
    const seedVal = seedCollection[iSeed]
    console.log(
      '------------------------------------------ Processing Seed: ',
      seedVal
    )
    let currentVal = seedVal
    let currentSource = 'seed'
    let pSeed = {
      seed: currentVal
    }
    for (iMap in mapCollection) {
      // checking each map
      const map = mapCollection[iMap]
      const { sourceName, targetName, entries } = map
      currentSource = sourceName
      console.log(' <> Processing Map: ', sourceName, ' -> ', targetName)
      for (iEntries in entries) {
        // checking map entries
        const { source, target, range } = entries[iEntries]
        if (currentVal >= source && currentVal < source + range) {
          const offset = currentVal - source
          currentVal = offset + target
          console.log(currentSource, ' - ', targetName, ' ------> ', currentVal)
          pSeed[targetName] = currentVal
          break
        } else if (iEntries == entries.length - 1) {
          console.log(
            currentSource,
            ' - ',
            targetName,
            ' ------> ',
            currentVal,
            '(no match)'
          )
          pSeed[targetName] = currentVal
        }
      }
    }
    processedSeeds.push(pSeed)
  }
  console.log('<<<<<<<<<<Finished Processing>>>>>>>>>>')
  console.log(processedSeeds)
  console.log(
    'Result of lowest Location Number: ',
    Math.min(
      ...processedSeeds.map(seed => {
        return seed.location
      })
    )
  )
}

const createSets = () => {
  const rawSets = []
  const startNums = []
  const endNums = []
  seedCollection.map((seed, i) => {
    if (i % 2 === 0) {
      startNums.push(seed)
    } else {
      endNums.push(seed)
    }
  })
  console.log({ starNums: startNums, endNums })
  for (i in startNums) {
    rawSets.push({
      start: startNums[i],
      end: endNums[i] + startNums[i] - 1
    })
  }
  console.log(rawSets)

  const reducedSets = []
  // optimize sets

  for (i in rawSets) {
    const rawSet = rawSets[i]
    console.log(rawSet)
    if (reducedSets.length === 0) {
      console.log('HI')
      reducedSets.push(rawSet)
    } else {
      for (x in reducedSets) {
        const rSet = reducedSets[x]
        if (
          rawSet.start >= rSet.start &&
          rawSet.start >= rSet.end &&
          rawSet.end >= rSet.start &&
          rawSet.end >= rSet.end
        ) {
          console.log('SET FITS!')
          break
        } else if (rawSet.end >= rSet.start && rawSet.end >= rSet.end) {
          console.log('INTERSECTS BOTTOM!')
          reducedSets[x] = {
            start: rawSet.start,
            end: rSet.end
          }
          break
        } else if (rawSet.start >= rSet.start && rawSet.start >= rSet.end) {
          console.log('INTERSECTS TOP!')
          reducedSets[x] = {
            start: rSet.start,
            end: rawSet.end
          }
          break
        } else {
          console.log('DOES NOT INTERSECT!')
          reducedSets.push(rawSet)
          break
        }
      }
    }
  }

  console.log({ reducedSets })
  let count = 0
  for (i in reducedSets) {
    set = reducedSets[i]
    count += set.end - set.start
  }
  setCollection.push(...reducedSets)
}

const processMoreSeeds = () => {
  console.log({ setCollection })
  for (iSC in setCollection) {
    let currentCollection = [setCollection[iSC]]
    for (iM in mapCollection) {
      // --------------------------------------------- head of map
      const { sourceName, targetName, entries } = mapCollection[iM]
      let collectionForEntries = [...currentCollection]
      console.log(
        '< - > ',
        sourceName,
        ' -> ',
        targetName,
        ' entries: ',
        entries.length
      )
      // --------------------------------------------- body of map
      for (iE in entries) {
        // ---------------------------------------------
        const { source, target, range } = entries[iE]
        const eStart = source
        const eEnd = source + range - 1
        const offset = target - source
        console.log(
          'processing entry: ',
          eStart,
          ' -> ',
          eEnd,
          ' offset: ',
          offset
        )
        console.log(
          '<<<<>>>> Iterations to make for upcoming entry: ',
          collectionForEntries.length
        )
        // ---------------------------------------------
        for (x in collectionForEntries) {
          const { start, end } = collectionForEntries[x]
          // ----------------------------------------------------------------------------------------------------------
          if (start >= eStart && end <= eEnd) {
            // set fits in
            console.log(
              '\x1b[33m%s\x1b[0m',
              'Set fits inside: ',
              sourceName,
              ' -> ',
              targetName,
              ' Entry Index: ',
              iE
            )
            currentCollection.push({
              start: start + offset,
              end: end + offset
            })
            collectionForEntries.splice(x, 1)
          } else if (
            (start < eStart && end < eStart) ||
            (start > eEnd && end > eEnd)
          ) {
            // set doesn't intersect, put range in "remaining" pool
            console.log(
              '\x1b[31m%s\x1b[0m',
              'Set does not intersect: ',
              sourceName,
              ' -> ',
              targetName,
              ' Entry Index: ',
              iE
            )
            collectionForEntries.splice(x, 1)
            collectionForEntries.push({
              start,
              end
            })
          } else if (start < eStart && end >= eStart && end <= eEnd) {
            // set intersects down
            console.log(
              '\x1b[34m%s\x1b[0m',
              'Set intersects down: ',
              sourceName,
              ' -> ',
              targetName,
              ' Entry Index: ',
              iE
            )
            currentCollection.push({
              start: eStart + offset,
              end: end + offset
            })
            collectionForEntries.push({
              start: start,
              end: eStart - 1
            })
            collectionForEntries.splice(x, 1)
          } else if (start >= eStart && start <= eEnd && end > eEnd) {
            // set intersects top
            console.log(
              '\x1b[35m%s\x1b[0m',
              'Set intersects top: ',
              sourceName,
              ' -> ',
              targetName,
              ' Entry Index: ',
              iE
            )
            currentCollection.push({
              start: start + offset,
              end: eEnd + offset
            })
            collectionForEntries.push({
              start: eEnd + 1,
              end: end
            })
            collectionForEntries.splice(x, 1)
          } else if (start >= eStart && start <= eEnd && end > eEnd) {
            // set swallows
            console.log(
              '\x1b[36m%s\x1b[0m',
              'Set swallows: ',
              sourceName,
              ' -> ',
              targetName,
              ' Entry Index: ',
              iE
            )
            currentCollection.push({
              start: eStart + offset,
              end: eEnd + offset
            })
            collectionForEntries.push(
              {
                start: start,
                end: eStart - 1
              },
              {
                start: eEnd + 1,
                end: end
              }
            )
            collectionForEntries.splice(x, 1)
          }
        }
      }
      console.log('Remaining entries: ', collectionForEntries)
      console.log('Processed entries: ', currentCollection)
      console.log(
        'LowestNum: ',
        Math.min(
          ...currentCollection.map(e => {
            return parseInt(e.start)
          })
        )
      )
    }
  }
}

rl.on('close', () => {
  if (mapBuffer.targetName != '') {
    console.log(entriesBuffer)
    mapBuffer.entries = entriesBuffer
    mapCollection.push(mapBuffer)

    entriesBuffer = []
    mapBuffer = {}
  }
  console.log('<<<<<<<<<  PARSING COMPLETE! >>>>>>>>>>')
  console.log('Seed: ', seedCollection)
  console.log(mapCollection)
  processSeeds()
  //   createSets()
  //   processMoreSeeds()
})
