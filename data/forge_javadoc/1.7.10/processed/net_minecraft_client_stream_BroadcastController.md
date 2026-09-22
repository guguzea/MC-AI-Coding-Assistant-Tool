# BroadcastController

**Inheritance:** java.lang.Object → net.minecraft.client.stream.BroadcastController

## Class signature

```java
public class BroadcastController extends java.lang.Object
```

## Constructors

- `BroadcastController()`

## Methods

- `void bufferUnlockCallback(long p_bufferUnlockCallback_1_)`
- `StreamInfo func_152816_j()`
- `boolean func_152817_A()`
- `boolean func_152818_a(java.lang.String p_152818_1_, AuthToken p_152818_2_)`
- `boolean func_152819_E()`
- `protected void func_152820_d(java.lang.String p_152820_1_)`
- `void func_152821_H()`
- `FrameBuffer func_152822_N()`
- `protected boolean func_152823_L()`
- `void func_152824_a(IngestServer p_152824_1_)`
- `boolean func_152825_o()`
- `protected PixelFormat func_152826_z()`
- `protected void func_152827_a(BroadcastController.BroadcastState p_152827_1_)`
- `boolean func_152828_a(java.lang.String p_152828_1_, java.lang.String p_152828_2_, java.lang.String p_152828_3_)`
- `void func_152829_a(float p_152829_1_)`
- `boolean func_152830_D()`
- `protected void func_152831_M()`
- `protected void func_152832_e(java.lang.String p_152832_1_)`
- `IngestServer func_152833_s()`
- `VideoParams func_152834_a(int p_152834_1_, int p_152834_2_, float p_152834_3_, float p_152834_4_)`
- `protected void func_152835_I()`
- `boolean func_152836_a(VideoParams p_152836_1_)`
- `void func_152837_b(float p_152837_1_)`
- `IngestServerTester func_152838_J()`
- `boolean func_152839_p()`
- `boolean func_152840_a(java.lang.String p_152840_1_, long p_152840_2_, java.lang.String p_152840_4_, java.lang.String p_152840_5_)`
- `void func_152841_a(BroadcastController.BroadcastListener p_152841_1_)`
- `void func_152842_a(java.lang.String p_152842_1_)`
- `ChannelInfo func_152843_l()`
- `long func_152844_x()`
- `boolean func_152845_C()`
- `void func_152846_a(FrameBuffer p_152846_1_)`
- `boolean func_152847_F()`
- `protected boolean func_152848_y()`
- `boolean func_152849_q()`
- `boolean func_152850_m()`
- `boolean func_152851_B()`
- `ErrorCode func_152852_P()`
- `protected boolean func_152853_a(ErrorCode p_152853_1_)`
- `boolean func_152854_G()`
- `IngestList func_152855_t()`
- `IngestServerTester func_152856_w()`
- `boolean func_152857_n()`
- `boolean func_152858_b()`
- `ErrorCode func_152859_b(FrameBuffer p_152859_1_)`
- `void getArchivingStateCallback(ErrorCode p_getArchivingStateCallback_1_, ArchivingState p_getArchivingStateCallback_2_)`
- `void getGameNameListCallback(ErrorCode p_getGameNameListCallback_1_, GameInfoList p_getGameNameListCallback_2_)`
- `void getIngestServersCallback(ErrorCode p_getIngestServersCallback_1_, IngestList p_getIngestServersCallback_2_)`
- `void getStreamInfoCallback(ErrorCode p_getStreamInfoCallback_1_, StreamInfo p_getStreamInfoCallback_2_)`
- `void getUserInfoCallback(ErrorCode p_getUserInfoCallback_1_, UserInfo p_getUserInfoCallback_2_)`
- `void loginCallback(ErrorCode p_loginCallback_1_, ChannelInfo p_loginCallback_2_)`
- `void requestAuthTokenCallback(ErrorCode p_requestAuthTokenCallback_1_, AuthToken p_requestAuthTokenCallback_2_)`
- `void runCommercialCallback(ErrorCode p_runCommercialCallback_1_)`
- `void sendActionMetaDataCallback(ErrorCode p_sendActionMetaDataCallback_1_)`
- `void sendEndSpanMetaDataCallback(ErrorCode p_sendEndSpanMetaDataCallback_1_)`
- `void sendStartSpanMetaDataCallback(ErrorCode p_sendStartSpanMetaDataCallback_1_)`
- `void setStreamInfoCallback(ErrorCode p_setStreamInfoCallback_1_)`
- `void startCallback(ErrorCode p_startCallback_1_)`
- `void statCallback(StatType p_statCallback_1_, long p_statCallback_2_)`
- `void stopCallback(ErrorCode p_stopCallback_1_)`

## Fields

- `protected IngestServerTester field_152860_A`
- `protected int field_152865_a`
- `protected int field_152866_b`
- `protected BroadcastController.BroadcastListener field_152867_c`
- `protected java.lang.String field_152868_d`
- `protected java.lang.String field_152869_e`
- `protected java.lang.String field_152870_f`
- `protected boolean field_152871_g`
- `protected Core field_152872_h`
- `protected Stream field_152873_i`
- `protected java.util.List field_152874_j`
- `protected java.util.List field_152875_k`
- `protected boolean field_152876_l`
- `protected boolean field_152877_m`
- `protected boolean field_152878_n`
- `protected BroadcastController.BroadcastState field_152879_o`
- `protected java.lang.String field_152880_p`
- `protected VideoParams field_152881_q`
- `protected AudioParams field_152882_r`
- `protected IngestList field_152883_s`
- `protected IngestServer field_152884_t`
- `protected AuthToken field_152885_u`
- `protected ChannelInfo field_152886_v`
- `protected UserInfo field_152887_w`
- `protected StreamInfo field_152888_x`
- `protected ArchivingState field_152889_y`
- `protected long field_152890_z`