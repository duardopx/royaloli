const screen = document.getElementById("screen")
const context = screen.getContext("2d")
const currentPlayerId = 'player1'


function createGame()
{
    const state = {
        players: {
            "player1" : { x: 1, y: 1 },
            "player2" : { x: 9, y: 9 }
        },

        fruits: {
            "fruit1" : { x: 3, y: 1 }
        }
    }

    function movePlayer(command)
    {
        console.log(`Moving ${command.playerId} with ${command.keyPressed}`)

        const keyPressed = command.keyPressed
        const player = state.players[command.playerId]

        if (keyPressed === "ArrowUp" && player.y - 1 >= 0)
        {
            player.y = player.y - 1
            return
        }

        if (keyPressed === "ArrowDown" && player.y + 1 < screen.height)
        {
            player.y = player.y + 1
            return
        }

        if (keyPressed === "ArrowLeft" && player.x - 1 >= 0)
        {
            player.x = player.x - 1
            return
        }

        if (keyPressed === "ArrowRight" && player.x + 1 < screen.width)
        {
            player.x = player.x + 1
            return
        }
    }

    return {
        movePlayer,
        state
    }
}

const game = createGame()
const keyBordListener =  createKeyboardListener()
// keyBordListener.subscribe(game.movePlayer)

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
        console.log(`Notifying ${state.observers.length} observers`)

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

