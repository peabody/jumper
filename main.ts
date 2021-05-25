namespace SpriteKind {
    export const Thing = SpriteKind.create()
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`end-flag-tile`, function (sprite, location) {
    game.over(true)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    music.pewPew.play()
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    p1_direction = -1
    animation.runImageAnimation(
    player1,
    assets.animation`Tommy-walk-l`,
    100,
    true
    )
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    p1_direction = 1
    animation.runImageAnimation(
    player1,
    assets.animation`Tommy-walk-r`,
    100,
    true
    )
})
function spawnEnemies () {
    for (let value of tiles.getTilesByType(assets.tile`spawnspot`)) {
        meanie = sprites.create(assets.image`Snek`, SpriteKind.Enemy)
        tiles.placeOnTile(meanie, value)
        tiles.setTileAt(value, assets.tile`transparency16`)
        meanie.vx = -50
    }
}
// Enemy kill and hurt logic
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (sprite.bottom < otherSprite.y) {
        otherSprite.destroy(effects.confetti, 500)
        otherSprite.setVelocity(0, 0)
        music.zapped.play()
        sprite.vy = -100
        scene.cameraShake(4, 500)
    } else {
        if (!(invincible)) {
            info.changeLifeBy(-1)
            invincible = game.runtime()
            music.powerDown.play()
        }
    }
})
let invincible = 0
let p1_direction = 0
let meanie: Sprite = null
let player1: Sprite = null
player1 = sprites.create(assets.image`Tommy`, SpriteKind.Player)
player1.z = 100
player1.ay = 500
controller.moveSprite(player1, 100, 0)
scene.setBackgroundColor(9)
tiles.setTilemap(tilemap`level1`)
scene.setBackgroundImage(assets.image`Forest`)
tiles.placeOnRandomTile(player1, sprites.swamp.swampTile1)
tiles.placeOnTile(meanie, tiles.getTileLocation(10, 13))
p1_direction = 1
invincible = 0
let invisible = false
let jumptime = 0
let jumping = false
spawnEnemies()
game.onUpdate(function () {
    if (Math.abs(player1.vx) == 0) {
        if (p1_direction == 1) {
            player1.setImage(assets.image`Tommy-r`)
        } else {
            player1.setImage(assets.image`Tommy`)
        }
    }
    if (game.runtime() - invincible > 1000) {
        invincible = 0
    }
    if (invincible) {
        player1.setFlag(SpriteFlag.Invisible, invisible)
        invisible = !(invisible)
    } else {
        player1.setFlag(SpriteFlag.Invisible, false)
    }
    if (player1.y > 240) {
        game.over(false, effects.splatter)
    }
    scene.centerCameraAt(player1.x, 175)
})
game.onUpdate(function () {
    // Enemy AI
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        if (value.isHittingTile(CollisionDirection.Left)) {
            value.vx = 50
            animation.runImageAnimation(
            value,
            assets.animation`Snek-r`,
            100,
            true
            )
        } else if (value.isHittingTile(CollisionDirection.Right)) {
            animation.runImageAnimation(
            value,
            assets.animation`Snek-l`,
            200,
            true
            )
            value.vx = -50
        } else if (value.tileKindAt(TileDirection.Bottom, sprites.builtin.forestTiles1)) {
            animation.runImageAnimation(
            value,
            assets.animation`Snek-r`,
            100,
            true
            )
            value.vx = 50
        } else if (value.tileKindAt(TileDirection.Bottom, sprites.builtin.forestTiles3)) {
            animation.runImageAnimation(
            value,
            assets.animation`Snek-l`,
            200,
            true
            )
            value.vx = -50
        }
    }
})
// Jump Logic. Longer A is held, higher the jump.
forever(function () {
    if (controller.A.isPressed()) {
        if (!(jumping)) {
            jumping = true
            jumptime = game.runtime()
            player1.vy = -150
        } else {
            if (!(game.runtime() - jumptime > 180)) {
                player1.vy = -150
            }
        }
    } else {
        jumptime = 0
    }
    if (player1.isHittingTile(CollisionDirection.Bottom)) {
        jumptime = 0
        jumping = false
    }
})
