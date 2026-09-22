# IHandshakeState

## Class signature

```java
public interface IHandshakeState<S>
```

## Methods

- `void accept(ChannelHandlerContext ctx, FMLHandshakeMessage msg, java.util.function.Consumer<? super S> cons)` — Accepts FML handshake message for this state, and if needed - switches to another handshake state using the provided consumer.