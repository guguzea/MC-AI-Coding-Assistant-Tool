# IPlayerFileData

## Class signature

```java
public interface IPlayerFileData
```

## Methods

- `java.lang.String[] getAvailablePlayerDat()` — Returns an array of usernames for which player.dat exists for.
- `NBTTagCompound readPlayerData(EntityPlayer player)` — Reads the player data from disk into the specified PlayerEntityMP.
- `void writePlayerData(EntityPlayer player)` — Writes the player data to disk from the specified PlayerEntityMP.