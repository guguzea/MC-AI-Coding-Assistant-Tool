# RConUtils

**Inheritance:** java.lang.Object → net.minecraft.network.rcon.RConUtils

## Class signature

```java
public class RConUtils extends java.lang.Object
```

## Constructors

- `RConUtils()`

## Methods

- `static java.lang.String getByteAsHexString(byte input)` — Returns a String representation of the byte in hexadecimal format
- `static int getBytesAsBEint(byte[] p_72664_0_, int p_72664_1_, int p_72664_2_)` — Read 4 bytes from the given array in big-endian format and return them as an int
- `static int getBytesAsLEInt(byte[] p_72665_0_, int p_72665_1_, int p_72665_2_)` — Read 4 bytes from the given array in little-endian format and return them as an int
- `static java.lang.String getBytesAsString(byte[] p_72661_0_, int p_72661_1_, int p_72661_2_)` — Read a null-terminated string from the given byte array
- `static int getRemainingBytesAsLEInt(byte[] p_72662_0_, int p_72662_1_)` — Read 4 bytes from the

## Fields

- `static char[] hexDigits` — Translation array of decimal to hex digits