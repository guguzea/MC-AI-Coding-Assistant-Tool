# NetworkHandshakeEstablished

## Class signature

```java
public class NetworkHandshakeEstablished extends java.lang.Object
```

## Constructors

- `public NetworkHandshakeEstablished( NetworkDispatcher dispatcher, INetHandler netHandler, Side origin)`

## Description

This message is sent through all channels affected by a currently occurring handshake. It is guaranteed to be able to send a custom payload packet, however, interaction with minecraft and world state