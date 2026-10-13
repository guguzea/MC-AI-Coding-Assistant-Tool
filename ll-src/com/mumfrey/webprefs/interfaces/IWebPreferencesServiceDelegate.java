package com.mumfrey.webprefs.interfaces;

import net.minecraft.util.Session;

import com.mumfrey.webprefs.framework.RequestFailureReason;

public interface IWebPreferencesServiceDelegate
{
    public abstract String getHostName();

    public abstract Session getSession();

    public abstract void onReceivedResponse(IWebPreferencesRequest request, IWebPreferencesResponse response);
    
    public abstract void onRequestFailed(IWebPreferencesRequest request, Throwable th, RequestFailureReason reason);
}
