# BroadcastController

**Inheritance:** java.lang.Object → net.minecraft.client.stream.BroadcastController

## Class signature

```java
public class BroadcastController extends java.lang.Object
```

## Constructors

- `BroadcastController()`

## Methods

- `void captureFramebuffer(FrameBuffer p_152846_1_)` — caputres the current framebuffer
- `boolean func_152817_A()`
- `boolean func_152818_a(java.lang.String p_152818_1_, AuthToken p_152818_2_)`
- `protected void func_152820_d(java.lang.String p_152820_1_)`
- `void func_152821_H()`
- `FrameBuffer func_152822_N()`
- `protected boolean func_152823_L()`
- `void func_152824_a(IngestServer p_152824_1_)`
- `protected PixelFormat func_152826_z()`
- `protected void func_152827_a(BroadcastController.BroadcastState p_152827_1_)`
- `boolean func_152828_a(java.lang.String p_152828_1_, java.lang.String p_152828_2_, java.lang.String p_152828_3_)`
- `protected void func_152831_M()`
- `protected void func_152832_e(java.lang.String p_152832_1_)`
- `IngestServer func_152833_s()`
- `VideoParams func_152834_a(int maxKbps, int p_152834_2_, float p_152834_3_, float p_152834_4_)`
- `protected void func_152835_I()`
- `boolean func_152836_a(VideoParams p_152836_1_)`
- `IngestServerTester func_152838_J()`
- `boolean func_152840_a(java.lang.String p_152840_1_, long p_152840_2_, java.lang.String p_152840_4_, java.lang.String p_152840_5_)`
- `void func_152841_a(BroadcastController.BroadcastListener p_152841_1_)`
- `void func_152842_a(java.lang.String p_152842_1_)`
- `long func_152844_x()`
- `boolean func_152845_C()`
- `boolean func_152847_F()`
- `protected boolean func_152848_y()`
- `boolean func_152849_q()`
- `boolean func_152851_B()`
- `protected boolean func_152853_a(ErrorCode p_152853_1_)`
- `boolean func_152854_G()`
- `IngestList func_152855_t()`
- `boolean func_152858_b()`
- `long func_177946_b(java.lang.String p_177946_1_, long p_177946_2_, java.lang.String p_177946_4_, java.lang.String p_177946_5_)`
- `boolean func_177947_a(java.lang.String p_177947_1_, long p_177947_2_, long p_177947_4_, java.lang.String p_177947_6_, java.lang.String p_177947_7_)`
- `ChannelInfo getChannelInfo()`
- `ErrorCode getErrorCode()`
- `StreamInfo getStreamInfo()`
- `boolean isBroadcasting()`
- `boolean isBroadcastPaused()`
- `boolean isIngestTesting()`
- `IngestServerTester isReady()`
- `boolean isReadyToBroadcast()`
- `boolean requestCommercial()`
- `void setPlaybackDeviceVolume(float p_152837_1_)`
- `void setRecordingDeviceVolume(float p_152829_1_)`
- `void statCallback()`
- `boolean stopBroadcasting()`
- `ErrorCode submitStreamFrame(FrameBuffer p_152859_1_)` — passes the framebuffer on to the video stream

## Fields

- `protected AudioParams audioParamaters`
- `protected AuthToken authenticationToken`
- `protected BroadcastController.BroadcastListener broadcastListener`
- `protected BroadcastController.BroadcastState broadcastState`
- `protected ChannelInfo channelInfo`
- `protected IngestServerTester field_152860_A`
- `protected int field_152865_a`
- `protected int field_152866_b`
- `protected java.lang.String field_152868_d`
- `protected java.lang.String field_152869_e`
- `protected java.lang.String field_152870_f`
- `protected boolean field_152871_g`
- `protected Core field_152872_h`
- `protected Stream field_152873_i`
- `protected java.util.List<FrameBuffer> field_152874_j`
- `protected java.util.List<FrameBuffer> field_152875_k`
- `protected boolean field_152876_l`
- `protected boolean field_152877_m`
- `protected boolean field_152878_n`
- `protected java.lang.String field_152880_p`
- `protected IngestServer field_152884_t`
- `protected ArchivingState field_152889_y`
- `protected long field_152890_z`
- `protected IStreamCallbacks field_177948_B`
- `protected IStatCallbacks field_177949_C`
- `protected IngestList ingestList`
- `protected StreamInfo streamInfo`
- `protected UserInfo userInfo`
- `protected VideoParams videoParamaters`