# NettyPacketEncoder

**Inheritance:** java.lang.Object → io.netty.channel.ChannelHandlerAdapter → io.netty.channel.ChannelOutboundHandlerAdapter → net.minecraft.network.NettyPacketEncoder

## Class signature

```java
public class NettyPacketEncoder extends io.netty.handler.codec.MessageToByteEncoder<Packet<?>>
```

## Constructors

- `NettyPacketEncoder(EnumPacketDirection direction)`

## Methods

- `protected void encode(io.netty.channel.ChannelHandlerContext p_encode_1_, Packet<?> p_encode_2_, io.netty.buffer.ByteBuf p_encode_3_)`