package com.example.examplehybrid;

import java.io.File;
import com.mumfrey.liteloader.LiteMod;
import com.mumfrey.liteloader.OutboundChatListener;
import net.minecraft.network.play.client.CPacketChatMessage;

public class LiteModExample implements LiteMod, OutboundChatListener {
    @Override public String getName() { return "examplehybrid"; }
    @Override public String getVersion() { return "1.0.0"; }
    @Override public void init(File configPath) { }
    @Override public void upgradeSettings(String version, File configPath, File oldConfigPath) { }

    @Override
    public void onSendChatMessage(CPacketChatMessage packet, String message) {
        // 客户端发出的聊天；自定义命令在此拦截。勿臆造未核实的其它方法名。
    }
}
