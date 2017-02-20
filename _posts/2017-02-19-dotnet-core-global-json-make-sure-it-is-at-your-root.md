# .NET Core: Make sure global.json is at the root of your repo

I was recently writing some .NET Core code and I was getting some strange error messages. It was something like...

```bash
"Can't parse project.json(1,1)"		
```

This was when I was deploying my application to Azure. As it would turn out, if you do not specify a `global.json` then Azure will automatically pick the latest version for you. This is a recipe for disaster considering I had not upgraded to the ABSOLUTE latest, as of yet. 

As it would turn out, it would seem that in .NET Core 1.1 had migrated to kill off the `project.json` format in favour of `.csproj` style a la `MSBuild`. I was not ready to migrate yet.

The fix is simple: just add a `global.json` specifying your SDK version. Or it would be, anyway if your file structure was that your app was at the root of the repo. Alas, that was not me so I got the above error message over and over.

The solution was to simply drop `global.json` into the root directory of my application folder. Bam, everything worked.

I hope this helps someone out.