package net.minecraft.src;

public class mod_Example extends BaseMod {
    @Override
    public String getVersion() {
        return "1.0.0";
    }

    @Override
    public void load() {
        ModLoader.addName(this, "Example");
    }

    @Override
    public void modsLoaded() {
    }
}
