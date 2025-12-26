@echo off
:: Script Installation for Text2Ae
:: Copies scripts to Adobe folders as requested

:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------

set "SOURCE=%~dp0"
set "AE_DEST=C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\Scripts\ScriptUI Panels"
REM AI 2025 path updated by user
set "AI_DEST=C:\Program Files\Adobe\Adobe Illustrator 2025\Presets\en_AE\Scripts"

echo ----------------------------------------
echo Installing Text2Ae Scripts...
echo ----------------------------------------

echo.
echo [1/2] Installing After Effects Script...
echo Source: %SOURCE%Text2Ae(AE).jsx
echo Dest:   %AE_DEST%
copy /Y "%SOURCE%Text2Ae(AE).jsx" "%AE_DEST%"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to copy to After Effects folder.
) else (
    echo [OK] Copied successfully.
)

echo.
echo [2/2] Installing Illustrator Script...
echo Source: %SOURCE%Text2Ae(AI).jsx
echo Dest:   %AI_DEST%
copy /Y "%SOURCE%Text2Ae(AI).jsx" "%AI_DEST%"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to copy to Illustrator folder.
) else (
    echo [OK] Copied successfully.
)

echo.
echo ----------------------------------------
echo Installation Finished.
echo ----------------------------------------
pause
