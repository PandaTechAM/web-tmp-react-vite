@echo off
setlocal EnableDelayedExpansion

:: Set the path to the hosts file and the entry details
set "HOSTS_PATH=%windir%\System32\drivers\etc\hosts"
set "IP=127.0.0.1"
set "DOMAIN=react.pandatech.it"
set "ENTRY=%IP%    %DOMAIN%"

:: Check if the entry already exists in the hosts file
findstr /M /C:"%ENTRY%" "%HOSTS_PATH%" >nul

:: If the entry was not found, add it with a preceding newline
if errorlevel 1 (
    echo Adding entry to hosts file...
    (
        echo.
        echo %ENTRY%
    ) >> "%HOSTS_PATH%"
) else (
    echo Entry already exists in the hosts file.
)

pause
endlocal