# Sounds

## Terminology

Term | Description
--- | ---
Sound Events | Something that triggers a sound effect. Examples include `"minecraft:block.anvil.hit"` or `"botania:spreaderFire"`.
Sound Category | The category of the sound, for example `"player"`, `"block"` or simply `"master"`. The sliders in the sound settings GUI represent these categories.
Sound File | The literal file on disk that is played, usually an .ogg file.

## `sounds.json

This JSON defines sound events, and defines which sound files they play, the subtitle, etc. Sound events are identified with [<code>ResourceLocation`](../../concepts/resources/#resourcelocation)s. `sounds.json` should be located at the root of a resource namespace (`assets/<namespace>/sounds.json`), and it defines sound events in that namespace (`assets/<namespace>/sounds.json` defines sound events in the namespace `namespace`.).

A full specification is available on the vanilla [wiki](https://minecraft.gamepedia.com/Sounds.json), but this example highlights the important parts:

```
{
  "open_chest": {
    "category": "block",
    "subtitle": "mymod.subtitle.openChest",
    "sounds": [ "mymod:open_chest_sound_file" ]
  },
  "epic_music": {
    "category": "record",
    "sounds": [
      {
        "name": "mymod:music/epic_music",
        "stream": true
      }
    ]
  }
}
```


<!-- key:🟠 role:常见错误 -->

Underneath the top-level object, each key corresponds to a sound event. Note that the namespace is not given, as it is taken from the namespace of the JSON itself. Each event specifies its category, and a localization key to be shown when subtitles are enabled. Finally, the actual sound files to be played are specified. Note that the value is an array; if multiple sound files are specified then the game will randomly choose one to play whenever the sound event is triggered.

The two examples represent two different ways to specify a sound file. The [wiki](https://minecraft.gamepedia.com/Sounds.json) has precise details, but generally, long sound files such as BGM or music discs should use the second form, because the &ldquo;stream&rdquo; argument tells Minecraft to not load the entire sound file into memory but to stream it from disk. The second form can also specify the volume, pitch, and random weight of a sound file.

In all cases, the path to a sound file for namespace `namespace` and path `path` is `assets/<namespace>/sounds/<path>.ogg`. Therefore `mymod:open_chest_sound_file` points to `assets/mymod/sounds/open_chest_sound_file.ogg`, and `mymod:music/epic_music` points to `assets/mymod/sounds/music/epic_music.ogg`.

## Creating Sound Events

In order to actually be able to play sounds, a `SoundEvent` corresponding to an entry in `sounds.json` must be created. This `SoundEvent` must then be [registered](../../concepts/registries/#registering-things). Normally, the location used to create a sound event should be set as it&rsquo;s registry name.

Creating a `SoundEvent`:

```
ResourceLocation location = new ResourceLocation("mymod", "open_chest");
SoundEvent event = new SoundEvent(location);
```

The `SoundEvent` acts as a reference to the sound, and is passed around to actually play sounds. Therefore, the `SoundEvent` should be stored somewhere. If a mod has an API, it should expose its `SoundEvent`s in the API.

## Playing Sounds

Vanilla has lots of methods for playing sounds, and it&rsquo;s unclear which to use at times.


<!-- key:🔴 role:新手必读 (Note) -->

> **Note**: Note This information was gathered by looking at these various methods, analyzing their usage and categorizing them accordingly. It is up-to-date as of Forge 1907, please let someone know if it is out of date!

Note that each takes a `SoundEvent`, the ones registered above. Additionally, the terms *&ldquo;Server Behavior&rdquo;* and *&ldquo;Client Behavior&rdquo;* refer to the respective [**logical** side](../../concepts/sides/).

### `World

1. <li> <p><a name="world-playsound-pbecvp"> <code>playSound(EntityPlayer, BlockPos, SoundEvent, SoundCategory, volume, pitch)` - <li>Simply forwards to [overload (2)](#world-playsound-pxyzecvp), adding 0.5 to each coordinate of the `BlockPos` given.
2. <li> <p><a name="world-playsound-pxyzecvp"> `playSound(EntityPlayer, double x, double y, double z, SoundEvent, SoundCategory, volume, pitch)` - <li>**Client Behavior**: If the passed in player is *the* client player, plays the sound event to the client player. - <li>**Server Behavior**: Plays the sound event to everyone nearby **except** the passed in player. Player can be `null`. - <li>**Usage**: The correspondence between the behaviors implies that these two methods are to be called from some player-initiated code that will be run on both logical sides at the same time - the logical client handles playing it to the user and the logical server handles everyone else hearing it without re-playing it to the original user. They can also be used to play any sound in general at any position server-side by calling it on the logical server and passing in a `null` player, thus letting everyone hear it.
3. <li> <p><a name="world-playsound-xyzecvpd"> `playSound(double x, double y, double z, SoundEvent, SoundCategory, volume, pitch, distanceDelay)` - <li>**Client Behavior**: Just plays the sound event in the client world. If `distanceDelay` is `true`, then delays the sound based on how far it is from the player. - <li>**Server Behavior**: Does nothing. - <li>**Usage**: This method only works client-side, and thus is useful for sounds sent in custom packets, or other client-only effect-type sounds. Used for thunder.

### `WorldClient

1. <li><a name="worldclient-playsound-becvpd"> <code>playSound(BlockPos, SoundEvent, SoundCategory, volume, pitch, distanceDelay)`- <li>Simply forwards to `World`&rsquo;s [overload (3)](#world-playsound-xyzecvpd), adding 0.5 to each coordinate of the `BlockPos` given.

### `Entity

1. <li><a name="entity-playsound-evp"> <code>playSound(SoundEvent, volume, pitch)`- <li>Forwards to `World`&rsquo;s [overload (2)](#world-playsound-pxyzecvp), passing in `null` as the player. - <li>**Client Behavior**: Does nothing. - <li>**Server Behavior**: Plays the sound event to everyone at this entity&rsquo;s position. - <li>**Usage**: Emitting any sound from any non-player entity server-side.

### `EntityPlayer

1. <li><a name="entityplayer-playsound-evp"> <code>playSound(SoundEvent, volume, pitch)` (overriding the one in [`Entity`](#entity-playsound-evp))- <li>Forwards to `World`&rsquo;s [overload (2)](#world-playsound-pxyzecvp), passing in `this` as the player. - <li>**Client Behavior**: Does nothing, see override in [`EntityPlayerSP`](#entityplayersp-playsound-evp). - <li>**Server Behavior**: Plays the sound to everyone nearby *except* this player. - <li>**Usage**: See [`EntityPlayerSP`](#entityplayersp-playsound-evp).

### `EntityPlayerSP

1. <li><a name="entityplayersp-playsound-evp"> <code>playSound(SoundEvent, volume, pitch)` (overriding the one in [`EntityPlayer`](#entityplayer-playsound-evp))- <li>Forwards to `World`&rsquo;s [overload (2)](#world-playsound-pxyzecvp), passing in `this` as the player. - <li>**Client Behavior**: Just plays the Sound Event. - <li>**Server Behavior**: Method is client-only. - <li>**Usage**: Just like the ones in `World`, these two overrides in the player classes seem to be for code that runs together on both sides. The client handles playing the sound to the user, while the server handles everyone else hearing it without re-playing to the original user.