const screen = document.getElementById("screen")
const context = screen.getContext("2d")
const currentPlayerId = 'player1'


function createGame()
{
    const state = {
        players: {},
        fruits: {}
    }

    function addPlayer(command)
    {
        const playerId = command.playerId
        const playerX = command.playerX
        const playerY = command.playerY

        state.players[playerId] = {
            x: playerX,
            y:playerY
        }
    }

    function removePlayer(command)
    {
        const playerId = command.playerId

        delete state.players[playerId]
    }

    function addFruit(command)
    {
        const fruitId = command.fruitId
        const fruitX = command.fruitX
        const fruitY = command.fruitY

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }
    }

    function removeFruit(command)
    {
        const fruitId = command.fruitId

        delete state.fruits[fruitId]
    }

    function movePlayer(command)
    {
        const acceptedMoves = {
            ArrowUp(player)
            {
                if (player.y - 1 >= 0)
                {
                    player.y = player.y - 1
                }
            },

            ArrowDown(player)
            {
                if (player.y + 1 < screen.height)
                {
                    player.y = player.y + 1
                }
            },

            ArrowLeft(player)
            {
                if (player.x - 1 >= 0)
                {
                    player.x = player.x - 1
                }
            },

            ArrowRight(player)
            {
                if (player.x + 1 < screen.width)
                {
                    player.x = player.x + 1
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[playerId]
        const moveFunction = acceptedMoves[keyPressed]


        if (player && moveFunction)
        {
            moveFunction(player)
            checkForFruitsCollision(playerId)
        }
    }

    function checkForFruitsCollision(playerId)
    {
        const player = state.players[playerId]

        for (fruitId in state.fruits)
        {
            const fruit = state.fruits[fruitId]

            console.log(`Checking between ${playerId} and ${fruitId}`)

            if (player.x === fruit.x && player.y === fruit.y)
            {
                console.log(`COLLISION between ${playerId} and ${fruitId}`)
                removeFruit({fruitId: fruitId})
            }
        }
    }

    return {
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state
    }
}

const game = createGame()
const keyBordListener =  createKeyboardListener()
keyBordListener.subscribe(game.movePlayer)

game.addPlayer({playerId: "player1", playerX: 4, playerY: 2})
game.addPlayer({playerId: "player2", playerX: 2, playerY: 0})
game.addPlayer({playerId: "player3", playerX: 5, playerY: 6})
game.addFruit({fruitId: "fruit1", fruitX: 1, fruitY: 8})
game.addFruit({fruitId: "fruit2", fruitX: 9, fruitY: 7})

function createKeyboardListener()
{
    document.addEventListener("keydown", handleKeydown)

    const state = {
        observers: []
    }

    function subscribe(observerFunction)
    {
        state.observers.push(observerFunction)
    }
    
    function notifyAll(command)
    {
        for (const observerFunction of state.observers)
        {
            observerFunction(command)
        }
    }

    function handleKeydown(event)
    {
        const keyPressed = event.key

        const command = {
            playerId: 'player1',
            keyPressed
        }
        notifyAll(command)
    }

    return {
        subscribe
    }
}


renderScreen()

function renderScreen()
{
    context.fillStyle = "white"
    context.clearRect( 0, 0, 10, 10 )

    for ( const playerId in game.state.players )
    {
        const player = game.state.players[playerId]
        context.fillStyle = "black"
        context.fillRect( player.x, player.y, 1, 1 )
    }

    for ( const fruitId in game.state.fruits )
    {
        const fruit = game.state.fruits[fruitId]
        context.fillStyle = "green"
        context.fillRect( fruit.x, fruit.y, 1, 1 )
    }

    requestAnimationFrame( renderScreen )
}

