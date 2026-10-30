# Fabric 1.21.10 已核实 API

来源：search_fabric_docs version=1.21.10（仅 github_raw_versioned）。禁止把 1.21.11 wiki 当本档。

| 名称 | 出处文档 id |
|------|-------------|
| PayloadTypeRegistry.playS2C / playC2S | 1.21.10/develop_networking |
| CustomPayload.Id / PacketCodec | 1.21.10/develop_networking |
| ServerPlayNetworking.send / registerGlobalReceiver | 1.21.10/develop_networking |
| ClientPlayNetworking.send / registerGlobalReceiver | 1.21.10/develop_networking |
| ItemGroupEvents.modifyEntriesEvent | 1.21.10/develop_items_first-item |
| CompostableItemRegistry | 1.21.10/develop_items_first-item |
| FuelRegistryEvents.BUILD | 1.21.10/develop_items_first-item |
| BlockEntity / BlockEntityType | 1.21.10/develop_blocks_block-entities |
| FabricBlockEntityTypeBuilder.Factory | 1.21.10/develop_blocks_block-entities |
| DataGeneratorEntrypoint#onInitializeDataGenerator | 1.21.10/develop_data-generation_setup |
| Item.Properties | 1.21.10/develop_items_first-item |
| loom / fabric-loom | 1.21.10/develop_loom_index |
| AttachmentRegistry.create / createPersistent / createDefaulted | 1.21.10/develop_data-attachments |
| AttachmentSyncPredicate.all / targetOnly / allButTarget | 1.21.10/develop_data-attachments |
| hasAttached / getAttached / getAttachedOrThrow / getAttachedOrSet / getAttachedOrElse | 1.21.10/develop_data-attachments |
| setAttached / modifyAttached / removeAttached | 1.21.10/develop_data-attachments |
| 注入目标 Entity / BlockEntity / ServerLevel / ChunkAccess | 1.21.10/develop_data-attachments |

Attachment 的**页正文**只写简名，示例代码是 `@[code](@/reference/1.21.10/…)` include —— 但这些被 include 的文件**在盘上**：`data/fabric_1.21.10/reference/1.21.10/src/main/java/com/example/docs/attachment/ExampleModAttachments.java:6-8` 逐字 import `net.fabricmc.fabric.api.attachment.v1.AttachmentRegistry` / `AttachmentSyncPredicate` / `AttachmentType`，`Stamina.java` 同目录 ⇒ **FQCN 已核实**。仍**未核实**的只有模块 id `fabric-attachment-api-v1`：本档没有 fabric-api 摘要可查（`loader-api-summaries/1.21.10-fabric-api.json` 的 1531 类里 attachment 命中 0），禁止把它当已核实依赖坐标输出。

核不到的类名写成「以该版文档为准，禁止默写」。
