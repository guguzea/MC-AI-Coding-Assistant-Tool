---
title: "PositionedSoundRecord"
description: "public class PositionedSoundRecord extends PositionedSound"
package: "net/minecraft/client/audio"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/audio/PositionedSoundRecord.html"
sourceType: javadoc
---

# PositionedSoundRecord

## Class signature

```java
public class PositionedSoundRecord extends PositionedSound
```

## Constructors

- `public PositionedSoundRecord( SoundEvent soundIn, SoundCategory categoryIn, float volumeIn, float pitchIn, BlockPos pos)`
- `public PositionedSoundRecord( SoundEvent soundIn, SoundCategory categoryIn, float volumeIn, float pitchIn, float xIn, float yIn, float zIn)`
- `public PositionedSoundRecord( ResourceLocation soundId, SoundCategory categoryIn, float volumeIn, float pitchIn, boolean repeatIn, int repeatDelayIn, ISound.AttenuationType attenuationTypeIn, float xIn, float yIn, float zIn)`

## Methods

- `public static PositionedSoundRecord getMasterRecord( SoundEvent soundIn, float pitchIn)`
- `public static PositionedSoundRecord getMusicRecord( SoundEvent soundIn)`
- `public static PositionedSoundRecord getRecordSoundRecord( SoundEvent soundIn, float xIn, float yIn, float zIn)`
