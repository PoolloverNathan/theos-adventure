abstract class Unlockable {
    protected abstract _unlock(): void;
    get unlocked() {
        return (this.locks <= 0);
    }
    locks: number;
    public unlock() {
        this.locks--;
        if (this.locks <= 0) {
            this.locks = 0;
            this._unlock();
        }
    }
}

class LevelLink {
    static links: LevelLink[];
    constructor(public loader: LevelLoader, public level: [tiles.TileMapData, number]) {
        LevelLink.links.push(this);
    }
    static find(sprite: Sprite) {
        for (let link of LevelLink.links) {
            if (link.loader.check(sprite)) {
                return link;
            }
        }
        return undefined;
    }
}

class LevelLoader extends Unlockable {
    constructor(public condition: () => boolean, public location: tiles.Location, public locks: number, public unlocks: Unlockable[]) {
        super();
    }
    check(sprite: Sprite | tiles.Location): boolean {
        let tmc = (sprite instanceof Sprite ? sprite.tilemapLocation() : sprite);
        if (!this.unlocked) return false;
        if (!this.condition()) return false;
        if (!this.overlaps(tmc)) return false;
        return true;
    }
    overlaps(tmc: tiles.Location): boolean {
        let trc = tmc.getNeighboringLocation(CollisionDirection.Left)
        let tdc = tmc.getNeighboringLocation(CollisionDirection.Top);
        let tcc = tdc.getNeighboringLocation(CollisionDirection.Left)
        if (tmc === this.location || trc === this.location
            || tdc === this.location || tcc === this.location) {
            return true;
        }
        return false;
    }
    _unlock() {
        let tdc = this.location.getNeighboringLocation(CollisionDirection.Bottom);
        let tcc = tdc.getNeighboringLocation(CollisionDirection.Right)
        animateSetTile(tdc, assets.tile`bedFrontLeft`)
        animateSetTile(tcc, assets.tile`bedFrontRight`)
    }
}

class BlockerLine extends Unlockable {
    direction: CollisionDirection.Right | CollisionDirection.Bottom
    protected tileDirection: CollisionDirection.Left | CollisionDirection.Top
    length: number;
    constructor(public location: tiles.Location, size: number, public locks: number) {
        super()
        if (size === 0) throw undefined;
        else if (size < 0) {this.direction = CollisionDirection.Bottom; this.tileDirection = CollisionDirection.Left;}
        else {this.direction = CollisionDirection.Right; this.tileDirection = CollisionDirection.Top}
        this.length = Math.abs(size);
    }
    _unlock() {
        let l = this.location;
        for (let i = 0; i < this.length; i++) {
            animateSetTile(l, tiles.getTileAtLocation(l.getNeighboringLocation(this.tileDirection)))
            l = l.getNeighboringLocation(this.direction)
        }
    }
}


const Coin = SpriteKind.create();

function explode(sprite: Sprite, rate: number = 500) {
    control.runInParallel(() => {
        while (1) {
            sprite.startEffect(effects.disintegrate)
            pause(rate);
        }
    })
}

function animateSetTile(location: tiles.Location, tile: Image, fixT: boolean = true, rate: number = null) {
    let ti = tiles.getTileAtLocation(location).clone();
    if (fixT) ti.replace(0, scene.backgroundColor());
    let ts = tiles.createTileSprite(location, ti);
    tiles.setTileAt(location, tile);
    explode(ts, rate);
}

function createCorg() {
    const retCorg = corgio.create(SpriteKind.Player);
    retCorg.horizontalMovement()
    retCorg.verticalMovement()
    scene.cameraFollowSprite(retCorg.sprite);
    return retCorg
}

function screenshot() {
    const scSpt = new Sprite(image.screenImage().clone());
    scSpt.z = -20;
    scSpt.setFlag(7680, true);
    scSpt.setPosition(scene.screenWidth() / 2, scene.screenHeight() / 2)
    return scSpt;
}