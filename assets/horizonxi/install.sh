#!/bin/bash
# Installs HorizonXI from scratch and configures a prefix. 

# Download launcher
cd ~/Downloads
wget https://github.com/HorizonFFXI/HorizonXI-Launcher-Binaries/releases/download/v1.0.0/HorizonXI-Launcher-1.0.0.Setup.exe 

# Launch the launcher
WINEPREFIX=~/.wine-horizonxi-64 wine "~/Downloads/HorizonXI-Launcher-1.0.0.Setup.exe"

# Do we need to do anything else to get it working? Should be OK I think, though


