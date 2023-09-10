import { useEffect, useState } from "react"
import { isArrayIncludesObject, isEqual, randomNumber } from "gladknee"

type Direction = "N" | "S" | "E" | "W"
type Position = { x: number; y: number }

function App() {
  const [direction, setDirection] = useState<Direction>("E")
  const [headPosition, setHeadPosition] = useState<Position>({ x: 0, y: 0 })
  const [isGameActive, setIsGameActive] = useState(true)
  const [bodyLength, setBodyLength] = useState(4)
  const [body, setBody] = useState<Position[]>([])
  const [applePosition, setApplePosition] = useState<Position>({
    x: randomNumber(0, 23),
    y: randomNumber(0, 23),
  })

  const updateBody = () => {
    if (!isGameActive) return
    if (isArrayIncludesObject(body, headPosition)) endGame("lose")
    setBody((body) => {
      const tempBody = [...body]
      tempBody.unshift(headPosition)
      if (tempBody.length > bodyLength) tempBody.pop()
      return tempBody
    })
  }

  const generateApple = () => {
    let newApple: Position = headPosition
    while (
      isEqual(newApple, headPosition) ||
      isArrayIncludesObject(body, newApple)
    ) {
      newApple = { x: randomNumber(0, 23), y: randomNumber(0, 23) }
    }
    setApplePosition(newApple)
  }

  const advanceEast = () => {
    if (headPosition.x === 23) endGame("lose")
    else {
      updateBody()
      setHeadPosition((headPosition) => ({
        x: headPosition.x + 1,
        y: headPosition.y,
      }))
    }
  }

  const advanceWest = () => {
    if (headPosition.x === 0) {
      endGame("lose")
    } else {
      updateBody()
      setHeadPosition((headPosition) => ({
        x: headPosition.x - 1,
        y: headPosition.y,
      }))
    }
  }

  const advanceNorth = () => {
    if (headPosition.y === 0) endGame("lose")
    else {
      updateBody()
      setHeadPosition((headPosition) => ({
        x: headPosition.x,
        y: headPosition.y - 1,
      }))
    }
  }

  const advanceSouth = () => {
    if (headPosition.y === 23) endGame("lose")
    else {
      updateBody()
      setHeadPosition((headPosition) => ({
        x: headPosition.x,
        y: headPosition.y + 1,
      }))
    }
  }

  const endGame = (reason: "win" | "lose") => {
    setIsGameActive(false)
    alert(reason)
  }

  const getCoordinates = (index: number) => {
    const x = index === 24 ? 24 : index % 24
    const y = Math.floor(index / 24)
    return { x, y }
  }

  useEffect(() => {
    setTimeout(() => {
      if (!isGameActive) return
      if (isEqual(headPosition, applePosition)) {
        setBodyLength((bodyLength) => bodyLength + 1)
        generateApple()
      }
      if (direction === "E") advanceEast()
      if (direction === "W") advanceWest()
      if (direction === "S") advanceSouth()
      if (direction === "N") advanceNorth()
    }, 75)
  }, [headPosition])

  useEffect(() => {
    document.body.addEventListener("keydown", (e) => {
      const { key } = e
      if (String(key).includes("Arrow")) e.preventDefault()
      if (key === "ArrowDown") setDirection("S")
      if (key === "ArrowLeft") setDirection("W")
      if (key === "ArrowUp") setDirection("N")
      if (key === "ArrowRight") setDirection("E")
    })
  }, [])

  return (
    <div>
      <div className="grid grid-cols-[repeat(24,1fr)] grid-rows-[repeat(24,1fr)]">
        {new Array(576).fill("").map((_, index) => {
          if (
            isEqual(getCoordinates(index), headPosition) ||
            isArrayIncludesObject(body, getCoordinates(index))
          ) {
            return <div className="bg-green-600 w-6 h-6" key={index} />
          } else if (isEqual(getCoordinates(index), applePosition)) {
            return <div className="bg-red-600 w-6 h-6" key={index} />
          } else return <div className="bg-slate-500 w-6 h-6" key={index} />
        })}
      </div>
    </div>
  )
}

export default App
