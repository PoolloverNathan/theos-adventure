let levelMode = false
let endLevelMode = () => {}

function startLevelMode(tm: tiles.TileMapData, color: number, winCb: () => void, loseCb: () => void) {
    levelMode = true;
    let player: Corgio = createCorg();
    // let owplayer: Sprite = null;

    // player.sprite.setVelocity(player.maxMoveVelocity, 0);

    /* function owMode() {
        player.verticalMovement(false);
        player.horizontalMovement(false);
        controller.moveSprite(player.sprite)
    } */

    tiles.onMapLoaded((tilemap: tiles.WorldMap) => {
        if (!levelMode) return;
        try {
            tiles.createSpritesOnTiles(assets.tile`coin_placeholder`, Coin);
            tiles.replaceAllTiles(assets.tile`coin_placeholder`, img``);
        } catch (e) {
            game.showLongText(e.stack, DialogLayout.Full);
            game.reset();
        }
    })

    tiles.onMapUnloaded((tilemap: tiles.WorldMap) => {
        if (!levelMode) return;
        tiles.destroySpritesOfKind(Coin)
    })

    sprites.onCreated(Coin, function (sprite: Sprite) {
        if (!levelMode) return;
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

    scene.setBackgroundColor(color)
    // let loadss = SceneExplosion();
    tiles.setCurrentTilemap(tm)
    // loadss();

    let playerDead = false;
    const die = function die() {
        if (playerDead) return;
        playerDead = true;
        music.powerDown.play()
        player.horizontalMovement(false);
        player.jumpVelocity = 0;
        explode(player.sprite, 100);
        loseCb();
    }

    scene.onOverlapTile(SpriteKind.Player, assets.tile`moltenCherryJuice`, function (sprite: Sprite, location: tiles.Location) {
        if (!levelMode) return;
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
        const { sprite } = player;
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

    controller.B.onEvent(ControllerButtonEvent.Pressed, () => {
        if (!levelMode) return;
        animateSetTile(player.sprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom), tiles.getTileAtLocation(player.sprite.tilemapLocation()));
    })


    let goalStage = 0;
    scene.onOverlapTile(SpriteKind.Player, assets.tile`flagpole`, (sprite, location) => {
        if (!levelMode) return;
        if (goalStage !== 0) return;
        tiles.placeOnTile(sprite, location)
        player.horizontalMovement(false)
        pause(500);
        sprite.setVelocity(0, sprite.vy)
        goalStage = 1;
        // SceneTransition()();
    })



    scene.onHitWall(SpriteKind.Player, (sprite: Sprite) => {
        if (tiles.tileAtLocationEquals(player.sprite.tilemapLocation(), assets.tile`flagpoleBase`)) {
            goalStage = 1;
            player.horizontalMovement(false);
            player.verticalMovement(false);
            pause(500);
            sprite.setVelocity(player.maxMoveVelocity, 0);
        }
    })

    scene.onOverlapTile(SpriteKind.Player, assets.tile`doghouseRight`, (sprite: Sprite, location: tiles.Location) => {
        if (goalStage !== 1) return;
        goalStage = 0;
        sprite.setVelocity(0, 0);
        pause(500);
        sprite.setFlag(128, true);
        pause(500);
        animateSetTile(sprite.tilemapLocation(), assets.tile`doghouseDoorClosed`);
        winCb();
    })

    endLevelMode = function() {
        levelMode = false
        player.sprite.destroy()
        goalStage = -1
        endLevelMode = () => {}
    }
}