# Start Backend, Frontend, and AI Service
Write-Host "Starting AI Service..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd ai-service; .\venv\Scripts\python.exe main.py`""

Write-Host "Starting Node Backend..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; npm run dev`""

Write-Host "Starting React Frontend..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""
