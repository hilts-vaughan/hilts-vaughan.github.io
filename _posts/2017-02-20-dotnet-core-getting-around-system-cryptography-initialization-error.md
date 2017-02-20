# `System.Security.Cryptography.Native` error on a web request? Upgrade `System.Net.Http` for .NET Core

I downloaded a sample .NET Core project off the web to play around with it. It was making use of web requests to proxy some data around the web. Everything was running fine until it would make an actual web request on my **Arch Linux** machine...

```c#
System.DllNotFoundException: Unable to load DLL 'System.Security.Cryptography.Native': The specified module could not be found.
 (Exception from HRESULT: 0x8007007E)
   at Interop.Crypto.GetMaxMdSize()
   at Interop.Crypto..cctor()
```

Ugh! This would happen every time I would make an outbound network request on `4.1.0` of `System.Net.Http` which is the version that was being used. The solution? I simply upgraded to the latest version, which as of writing today, is `4.3.0` The problem went away.

I am not sure if this was a bug being triggered or not but it seemed to have worked. Frustratingly, this was originally a red herring for my other [problem that I had a few weeks ago](/openssl-with-sslv3-on-arch-linux-for-dot-net-core.html) -- oh well. :(

I hope this helps someone else. 	