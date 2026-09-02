# NeoForge 1.20.6 已核实 API

来源：search_neoforge_docs（version=1.20.6）。每条可追溯文档 id。禁止把 Forge RegistryObject / SimpleChannel 当本档正解。

| 名称 | 出处文档 id |
|------|-------------|
| DeferredRegister.Items / createItems | items |
| DeferredRegister.Blocks / createBlocks / DeferredBlock | blocks |
| @Mod + IEventBus | gettingstarted/modfiles |
| Payload 类名未核实：search_neoforge_docs query=networking version=1.20.6；禁止抄 1.21 RegisterPayloadHandlersEvent / DirectionalPayloadHandler | networking |
| ModConfigSpec | misc/config |
| AttachmentType.builder / AttachmentType#serializable / Builder.copyOnDeath / Builder.build | datastorage/attachments + `1.20.6-neoforge.json`（`net.neoforged.neoforge.attachment.AttachmentType`） |
| NeoForgeRegistries.ATTACHMENT_TYPES 与 `DeferredRegister<AttachmentType<?>>` → `ATTACHMENT_TYPES.register(modBus)` | datastorage/attachments（摘要无字段，该注册表字段本身以该页为准） |
| getData / setData / hasData / setChanged / INBTSerializable / IAttachmentSerializer | datastorage/attachments + 摘要 `AttachmentHolder` / `IAttachmentHolder` |
| PlayerEvent.Clone（`#isWasDeath`）/ ChunkWatchEvent.Sent | datastorage/attachments（死亡复制与区块同步须自己接，本档无 syncWith 一等公民） |
| BlockEntity / BlockEntityType.Builder | blockentities |
| MenuType | gui/menus |
| GatherDataEvent / RecipeProvider / LanguageProvider | resources |
| DataMapType / RegisterDataMapTypesEvent | datamaps |
| @SubscribeEvent / LivingJumpEvent | concepts/events |
| 无独立 entities 页；禁止默写 EntityType.Builder | concepts/registries |

