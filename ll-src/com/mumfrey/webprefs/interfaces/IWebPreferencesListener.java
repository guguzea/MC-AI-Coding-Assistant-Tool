package com.mumfrey.webprefs.interfaces;

import java.util.Set;

public interface IWebPreferencesListener
{
    public abstract void onCommitSuccess(IReliableWebPreferences preferences, Set<String> keys);

    public abstract void onCommitFailed(IReliableWebPreferences preferences, Set<String> keys);
}
