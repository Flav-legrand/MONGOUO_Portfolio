# deploy_quick.ps1 - Version rapide pour MONGOUO_Portfolio
Write-Host "Deploiement sur MONGOUO_Portfolio..." -ForegroundColor Cyan

$RepoName = "MONGOUO_Portfolio"
$GitHubUsername = "Flav-legrand"
$Branch = "main"

# 1. Preparer docs
if (Test-Path "docs") { Remove-Item -Recurse -Force docs }

New-Item -ItemType Directory -Force -Path docs/css, docs/js, docs/assets/images, docs/assets/cv | Out-Null

Copy-Item index.html docs/ -Force
Copy-Item css/style.css docs/css/ -Force
Copy-Item js/main.js docs/js/ -Force

if (Test-Path "assets/images/Flav.jpg") { Copy-Item assets/images/Flav.jpg docs/assets/images/ -Force }
if (Test-Path "assets/cv/CV_Flav-Legrand.pdf") { Copy-Item assets/cv/CV_Flav-Legrand.pdf docs/assets/cv/ -Force }

New-Item docs\.nojekyll -Force | Out-Null

# 2. Git push
if (Test-Path ".git") { Remove-Item -Recurse -Force .git }

git init
git add .
git commit -m "Deploiement portfolio"
git remote add origin "https://github.com/$GitHubUsername/$RepoName.git"
git push -u origin $Branch --force

Write-Host ""
Write-Host "Termine!" -ForegroundColor Green
Write-Host "Site: https://$GitHubUsername.github.io/$RepoName/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Activez GitHub Pages:" -ForegroundColor Cyan
Write-Host "https://github.com/$GitHubUsername/$RepoName/settings/pages" -ForegroundColor Gray
Write-Host "Source: main branch /docs folder" -ForegroundColor Gray

pause