@echo off
REM התקנת חבילות
call npm run install-all

REM בניית הפרויקט
call npm run build

REM יצירת תיקיית public אם לא קיימת
if not exist "Back\public" mkdir Back\public

REM העתקת קבצי הבילד
xcopy /E /I /Y "Front\dist\*" "Back\public"

REM העתקת קובץ הenv
copy .env Back\.env