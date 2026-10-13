package com.mumfrey.webprefs.interfaces;

import java.util.Map;
import java.util.Set;

import com.mumfrey.webprefs.framework.RequestFailureReason;

public interface IWebPreferencesClient
{
    public abstract void onGetRequestSuccess(String uuid, Map<String, String> values);

    public abstract void onSetRequestSuccess(String uuid, Set<String> keys);

    public abstract void onGetRequestFailed(String uuid, Set<String> keys, RequestFailureReason reason);

    public abstract void onSetRequestFailed(String uuid, Set<String> keys, RequestFailureReason reason);
}
