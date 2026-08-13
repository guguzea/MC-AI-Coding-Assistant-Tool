package com.example.examplelitemod;

import java.io.File;
import com.mumfrey.liteloader.LiteMod;

public class LiteModExample implements LiteMod {
    @Override public String getName() { return "examplelitemod"; }
    @Override public String getVersion() { return "1.0.0"; }
    @Override public void init(File configPath) { }
    @Override public void upgradeSettings(String version, File configPath, File oldConfigPath) { }
}
