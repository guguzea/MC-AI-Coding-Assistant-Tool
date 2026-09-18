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
- `public static PositionedSoundRecord getRecord( SoundEvent soundIn, float pitchIn, float volumeIn)`
- `public static PositionedSoundRecord getMusicRecord( SoundEvent soundIn)`
- `public static PositionedSoundRecord getRecordSoundRecord( SoundEvent soundIn, float xIn, float yIn, float zIn)`