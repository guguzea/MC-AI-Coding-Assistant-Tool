# Delta

**Inheritance:** java.lang.Object → cpw.mods.fml.repackage.com.nothome.delta.Delta

## Class signature

```java
public class Delta extends java.lang.Object
```

## Constructors

- `Delta()`

## Methods

- `byte[] compute(byte[] source, byte[] target)` — Compares the source bytes with target bytes, returning output.
- `void compute(byte[] source, byte[] target, java.io.OutputStream output)` — Compares the source bytes with target bytes, writing to output.
- `void compute(byte[] sourceBytes, java.io.InputStream inputStream, DiffWriter diffWriter)` — Compares the source bytes with target input, writing to output.
- `void compute(java.io.File sourceFile, java.io.File targetFile, DiffWriter output)` — Compares the source file with a target file, writing to output.
- `void compute(SeekableSource seekSource, java.io.InputStream targetIS, DiffWriter output)` — Compares the source with a target, writing to output.
- `static void main(java.lang.String[] argv)` — Creates a patch using file names.
- `void setChunkSize(int size)` — Sets the chunk size used.

## Fields

- `static int DEFAULT_CHUNK_SIZE` — Default size of 16.