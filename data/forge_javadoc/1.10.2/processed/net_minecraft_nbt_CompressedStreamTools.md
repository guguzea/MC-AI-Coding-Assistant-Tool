# CompressedStreamTools

**Inheritance:** java.lang.Object → net.minecraft.nbt.CompressedStreamTools

## Class signature

```java
public class CompressedStreamTools extends java.lang.Object
```

## Constructors

- `CompressedStreamTools()`

## Methods

- `static NBTTagCompound read(java.io.DataInput input, NBTSizeTracker accounter)`
- `static NBTTagCompound read(java.io.DataInputStream inputStream)`
- `static NBTTagCompound read(java.io.File fileIn)`
- `static NBTTagCompound readCompressed(java.io.InputStream is)`
- `static void safeWrite(NBTTagCompound compound, java.io.File fileIn)`
- `static void write(NBTTagCompound compound, java.io.DataOutput output)`
- `static void write(NBTTagCompound compound, java.io.File fileIn)`
- `static void writeCompressed(NBTTagCompound compound, java.io.OutputStream outputStream)`