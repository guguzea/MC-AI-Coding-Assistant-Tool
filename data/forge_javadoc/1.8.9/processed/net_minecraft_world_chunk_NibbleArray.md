# NibbleArray

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.NibbleArray

## Class signature

```java
public class NibbleArray extends java.lang.Object
```

## Constructors

- `NibbleArray()`
- `NibbleArray(byte[] storageArray)`

## Methods

- `int get(int x, int y, int z)` — Returns the nibble of data corresponding to the passed in x, y, z. y is at most 6 bits, z is at most 4.
- `byte[] getData()`
- `int getFromIndex(int index)`
- `void set(int x, int y, int z, int value)` — Arguments are x, y, z, val.
- `void setIndex(int index, int value)`