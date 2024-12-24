var inputs = readline().split(' ');
const width = parseInt(inputs[0]); // columns in the game grid
const height = parseInt(inputs[1]); // rows in the game grid
// game loop
var nextTarget = null
var nextStart = null
var protHarv = []

function harv(game, x, y)
{
    console.error(x, y, "", game.myProt.C > 0 && game.myProt.D > 0)
    if (game.grid[y][x + 1].protein != null && game.myProt.C > 0 && game.myProt.D > 0)
    {
        protHarv.push({"y":y,"x":x + 1})
        console.log(`GROW ${game.grid[nextStart[1]][nextStart[0]].organId} ${nextStart[0]} ${nextStart[1] + 1} HARVESTER E`)
        game.myProt.C -= 1
        game.myProt.D -= 1
        return true
    }
    if (game.grid[y][x - 1].protein != null && game.myProt.C > 0 && game.myProt.D > 0)
    {
        protHarv.push({"y":y,"x":x - 1})
        console.log(`GROW ${game.grid[nextStart[1]][nextStart[0]].organId} ${nextStart[0]} ${nextStart[1] - 1} HARVESTER W`)
        game.myProt.C -= 1
        game.myProt.D -= 1
        return true
    }
    if (game.grid[y + 1][x].protein != null && game.myProt.C > 0 && game.myProt.D > 0)
    {
        protHarv.push({"y":y + 1,"x":x})
        console.log(`GROW ${game.grid[nextStart[1]][nextStart[0]].organId} ${nextStart[0] + 1} ${nextStart[1]} HARVESTER S`)
        game.myProt.C -= 1
        game.myProt.D -= 1
        return true
    }
    if (game.grid[y - 1][x].protein != null && game.myProt.C > 0 && game.myProt.D > 0)
    {
        protHarv.push({"y":y - 1,"x":x})
        console.log(`GROW ${game.grid[nextStart[1]][nextStart[0]].organId} ${nextStart[0] - 1} ${nextStart[1]} HARVESTER N`)
        game.myProt.C -= 1
        game.myProt.D -= 1
        return true
    }
    return false
}

function look_4_target(prot, orga, orgaId)
{
    var minDist = 6000
    for (let i = 0; i < prot.length; i++)
    {
        let dist = 0;
        for (let j = 0; j < orga.length; j++)
        {
            dist = 0
            dist += Math.abs(orga[j][0] - prot[i][0])
            dist += Math.abs(orga[j][1] - prot[i][1])
            if (dist < minDist)
            {
                minDist = dist;
                nextTarget = prot[i];
                nextStart = orga[j];
            }
        }
    }
}

function build_path(game)
{
    if ((nextStart[0] == nextTarget[0]) && (nextStart[1] == nextTarget[1]))
        return false;
    if (nextStart[0] == nextTarget[0])
    {
        if (nextTarget[1] > nextStart[1])
        {
            if (!harv(game, nextStart[0], nextStart[1] + 1) && game.myProt.A > 0)
            {
                console.log(`GROW ${game.grid[nextStart[1]][nextStart[0]].organId} ${nextStart[0]} ${nextStart[1] + 1} BASIC`)
                nextStart[1] += 1
                return true
            }
        }
        else
        {
            if (!harv(game, nextStart[0], nextStart[1] - 1) && game.myProt.A > 0)
            {
                console.log(`GROW ${game.grid[nextStart[1]][nextStart[0]].organId} ${nextStart[0]} ${nextStart[1] - 1} BASIC`)
                nextStart[1] -= 1
                return true
            }
        }
    }
    else
    {
        if (nextTarget[0] > nextStart[0])
        {
            if (!harv(game, nextStart[0] + 1, nextStart[1]) && game.myProt.A > 0)
            {
                console.log(`GROW ${game.grid[nextStart[1]][nextStart[0]].organId} ${nextStart[0] + 1} ${nextStart[1]} BASIC`)
                nextStart[0] += 1
                return true
            }
        }
        else
        {
            if (!harv(game, nextStart[0] - 1, nextStart[1]) && game.myProt.A > 0)
            {
                console.log(`GROW ${game.grid[nextStart[1]][nextStart[0]].organId} ${nextStart[0] - 1} ${nextStart[1]} BASIC`)
                nextStart[0] -= 1
                return true
            }
        }
    }
    return false
}

while (true) {
    const game = {
        grid: [],
        myProt: { A: 0 , B: 0, C: 0, D: 0 },
        oppProt: { A: 0 , B: 0, C: 0, D: 0 },
        myOrgans: [],
        oppOrgans: [],
        organMap: new Map()
    }

    for (let y = 0; y < height; ++y) {
        game.grid.push(new Array(width))
        for (let x = 0; x < width; ++x) {
            game.grid[y][x] = {
                position: { x, y },
                isWall: false,
                organId: null,
                organType: null,
                protein: null,
                owner: null
            }
        }
    }
    var prot = []
    var orga = []
    const entityCount = parseInt(readline());
    for (let i = 0; i < entityCount; i++) {
        var inputs = readline().split(' ');
        const x = parseInt(inputs[0]);
        const y = parseInt(inputs[1]); // grid coordinate
        const type = inputs[2]; // WALL, ROOT, BASIC, TENTACLE, HARVESTER, SPORER, A, B, C, D
        const owner = parseInt(inputs[3]); // 1 if your organ, 0 if enemy organ, -1 if neither
        const organId = parseInt(inputs[4]); // id of this entity if it's an organ, 0 otherwise
        const organDir = inputs[5]; // N,E,S,W or X if not an organ
        const organParentId = parseInt(inputs[6]);
        const organRootId = parseInt(inputs[7]);
        if (type == "WALL")
            game.grid[y][x].isWall = true
        if (type == "A" || type == "B" || type == "C" || type == "D")
        {
            game.grid[y][x].protein = type
        }
        if (type == "ROOT" || type == "BASIC" || type == "TENTACLE" || type == "HARVESTER" || type == "SPORER")
        {
            game.grid[y][x].organId = organId
            game.grid[y][x].organType = type
        }
        if (type == "A")
            prot.push([x, y])
        if (owner == 1)
        {
            orga.push([x, y])
        }
        game.grid[y][x].owner = owner
    }
    console.error("prot")
    look_4_target(prot, orga)
    var inputs = readline().split(' ');
    game.myProt.A = parseInt(inputs[0]);
    game.myProt.B = parseInt(inputs[1]);
    game.myProt.C = parseInt(inputs[2]);
    game.myProt.D = parseInt(inputs[3]); // your protein stock

    var inputs = readline().split(' ');
    const oppA = parseInt(inputs[0]);
    const oppB = parseInt(inputs[1]);
    const oppC = parseInt(inputs[2]);
    const oppD = parseInt(inputs[3]); // opponent's protein stock
    const requiredActionsCount = parseInt(readline()); // your number of organisms, output an action for each one in any order
    for (let i = 0; i < requiredActionsCount; i++)
    {
        if (game.myProt.A > 0 || game.myProt.B > 0 || game.myProt.C > 0 || game.myProt.D > 0)
            build_path(game)
        else
            console.log("WAIT")
    }
    console.error("-----")
}
