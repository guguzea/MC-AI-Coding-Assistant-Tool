# NettyCompressionDecoder

## Class signature

```java
public class NettyCompressionDecoder extends ByteToMessageDecoder
```

## Constructors

- `public NettyCompressionDecoder(int treshold)`

## Methods

- `protected void decode(ChannelHandlerContext p_decode_1_, ByteBuf p_decode_2_, java.util.List<java.lang.Object> p_decode_3_) throws java.util.zip.DataFormatException, java.lang.Exception`
- `public void setCompressionTreshold(int treshold)`