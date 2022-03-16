class Map extends tiles.WorldMap {
    backgroundColor: number
}
class Level extends Map {
    overworld: World
}
class World extends Map {

}

const Coin = SpriteKind.create();


function createCorg () {
    const myCorg = corgio.create(SpriteKind.Player)
    myCorg.horizontalMovement()
    myCorg.verticalMovement()
    scene.cameraFollowSprite(myCorg.sprite)
    return myCorg
}

function SceneExplosion(effect: effects.ParticleEffect = null) {
    const ss = new Sprite(image.screenImage().clone());
    ss.setFlag(7680, true); // ;)
    ss.setPosition(scene.screenWidth() / 2, scene.screenHeight() / 2)
    return () => {
        control.runInParallel(() => {
            while (true) ss.startEffect(effect || effects.disintegrate);
        })
    }
} 

function explode(sprite: Sprite) {
    control.runInParallel(() => {
        while (true) sprite.startEffect(effects.disintegrate);
    })
}

function TileExplosion(location: tiles.Location, effect: effects.ParticleEffect = null) {
    const ts = tiles.createTileSprite(location, tiles.getTileAtLocation(location));
    return () => explode(ts);
}

let goalStage = 0;
scene.onOverlapTile(SpriteKind.Player, assets.tile`flagpole`, (sprite, location) => {
    if (goalStage !== 0) return;
    tiles.placeOnTile(sprite, location)
    player.horizontalMovement(false)
    pause(500);
    player.sprite.setVelocity(0, player.sprite.vy)
    goalStage = 1;
    // SceneTransition()();
})



scene.onHitWall(SpriteKind.Player, (sprite: Sprite) => {
    if (tiles.tileAtLocationEquals(player.sprite.tilemapLocation(), assets.tile`flagpoleBase`)) {
        player.horizontalMovement(false);
        player.verticalMovement(false);
        pause(500);
        player.sprite.setVelocity(player.maxMoveVelocity, 0);
    }
})

scene.onOverlapTile(SpriteKind.Player, assets.tile`doghouseRight`, (sprite: Sprite, location: tiles.Location) => {
    sprite.setVelocity(0, 0);
    pause(500);
    sprite.setFlag(SpriteFlag.Invisible, true)
})

let player: Corgio = createCorg();
let owplayer: Sprite = null;

// player.sprite.setVelocity(player.maxMoveVelocity, 0);

function transitionToOverworld() {
    player.verticalMovement(false);
    player.horizontalMovement(false);
    controller.moveSprite(player.sprite)
}

tiles.onMapLoaded((tilemap: tiles.WorldMap) => {
    try {
    tiles.createSpritesOnTiles(assets.tile`coin_placeholder`, Coin);
    tiles.replaceAllTiles(assets.tile`coin_placeholder`, img``);
    } catch (e) {
        game.showLongText(e.stack, DialogLayout.Full);
        game.reset();
    }
})

tiles.onMapUnloaded((tilemap: tiles.WorldMap) => {
    tiles.destroySpritesOfKind(Coin)
})

sprites.onCreated(Coin, function(sprite: Sprite) {
    animation.runImageAnimation(sprite, assets.animation`coin`, 100, true);
})

/*const playerState = {
    deathFrames: NaN,
    dying: false
}



forever(() => {
    playerState.deathFrames--;
    let debuggerInfo = JSON.stringify(playerState)
    if (playerState.deathFrames <= 0) {
        deathAnimation(playerState.deathFrames)
    }
    console.logValue("deathFrames", playerState.deathFrames)
})*/

scene.setBackgroundColor(9)
tiles.setCurrentTilemap(tilemap`level1-1`)

function die() {
    music.powerDown.play()
    explode(player.sprite);
}

scene.onOverlapTile(SpriteKind.Player, assets.tile`moltenCherryJuice`, function(sprite: Sprite, location: tiles.Location) {
    // @ts-ignore-line
    /*
    if (player.sprite !== sprite | playerState.dying) return;
    player.horizontalMovement(false);
    // player.verticalMovement(false);
    player.maxJump = 0;
    player.sprite.vx = 0;
    playerState.dying = true;
    playerState.deathFrames = 10;
    */
    die();
})

function deathAnimation(f: number) {
    const {sprite} = player;
    f = Math.abs(f);
    if (f > 0 && f <= 20) {
        sprite.vy = 2;
    }
    pause(20);
}

/*
player.sprite.setStayInScreen(false);
player.sprite.setFlag(SpriteFlag.GhostThroughWalls, true);
player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false);
player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false);
player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false);
player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false);
player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false);
player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false);
player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false);
player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false);
player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false);
player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false);
player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false); player.verticalMovement(false);
tiles.placeOnTile(player.sprite, new tiles.Location(-1, 12, new tiles.TileMap(16)))

scene.onOverlapTile(SpriteKind.Player, assets.tile`bedRight`, () => {
    player.sprite.setVelocity(0, 0);
    player.sprite.setFlag(SpriteFlag.GhostThroughWalls, false);
    player.horizontalMovement()
    player.verticalMovement()
    player.sprite.setStayInScreen(true);
});*/

tiles.placeOnRandomTile(player.sprite, assets.tile`bedLeft`);
player.sprite.x += 8;