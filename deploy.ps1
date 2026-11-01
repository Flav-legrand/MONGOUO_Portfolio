# deploy_quick.ps1 - Version rapide pour MONGOUO_Portfolio
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DEPLOIEMENT PORTFOLIO VERSION PROJETS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$RepoName = "MONGOUO_Portfolio"
$GitHubUsername = "Flav-legrand"
$Branch = "main"

# 1. Verifier les fichiers avant déploiement
Write-Host "[1/5] Verification des fichiers..." -ForegroundColor Yellow

if (-not (Test-Path "index.html")) { Write-Host "   ERREUR: index.html manquant" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path "css/style.css")) { Write-Host "   ERREUR: css/style.css manquant" -ForegroundColor Red; pause; exit 1 }
if (-not (Test-Path "js/main.js")) { Write-Host "   ERREUR: js/main.js manquant" -ForegroundColor Red; pause; exit 1 }

Write-Host "   Fichiers verifies" -ForegroundColor Green
Write-Host ""

# 2. Preparer dossier docs
Write-Host "[2/5] Preparation du dossier docs..." -ForegroundColor Yellow

if (Test-Path "docs") { 
    Remove-Item -Recurse -Force docs
    Write-Host "   Ancien dossier docs supprime" -ForegroundColor Gray
}

New-Item -ItemType Directory -Force -Path docs/css, docs/js, docs/assets/images, docs/assets/cv | Out-Null

Copy-Item index.html docs/ -Force
Copy-Item css/style.css docs/css/ -Force
Copy-Item js/main.js docs/js/ -Force
Write-Host "   Fichiers HTML/CSS/JS copies" -ForegroundColor Green

# Copier l'image si elle existe
if (Test-Path "assets/images/Flav.jpg") { 
    Copy-Item assets/images/Flav.jpg docs/assets/images/ -Force
    Write-Host "   Image Flav.jpg copiee" -ForegroundColor Green
} else {
    Write-Host "   Avertissement: Image Flav.jpg non trouvee" -ForegroundColor Yellow
}

# Copier les captures des projets
if (Test-Path "assets/images/projets") {
    Copy-Item assets/images/projets docs/assets/images/ -Recurse -Force
    Write-Host "   Captures des projets copiees" -ForegroundColor Green
}

# Copier le CV s'il existe
if (Test-Path "assets/cv/CV_Flav-Legrand.pdf") { 
    Copy-Item assets/cv/CV_Flav-Legrand.pdf docs/assets/cv/ -Force
    Write-Host "   CV copie" -ForegroundColor Green
} else {
    Write-Host "   Avertissement: CV non trouve" -ForegroundColor Yellow
}

# Ajouter .nojekyll pour GitHub Pages
New-Item docs\.nojekyll -Force | Out-Null
Write-Host "   Fichier .nojekyll cree" -ForegroundColor Green
Write-Host ""

# 3. Initialisation Git
Write-Host "[3/5] Initialisation Git..." -ForegroundColor Yellow

if (Test-Path ".git") { 
    Remove-Item -Recurse -Force .git
    Write-Host "   Ancien depot Git supprime" -ForegroundColor Gray
}

git init
git branch -M $Branch
git remote add origin "https://github.com/$GitHubUsername/$RepoName.git"
Write-Host "   Depot Git initialise" -ForegroundColor Green
Write-Host ""

# 4. Commit et Push
Write-Host "[4/5] Commit et Push vers GitHub..." -ForegroundColor Yellow

git add .
git commit -m "Mise a jour portfolio - Ajout section Projets $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "   Commit effectue" -ForegroundColor Green

Write-Host "   Envoi vers GitHub..." -ForegroundColor Gray
git push -u origin $Branch --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Push reussi" -ForegroundColor Green
} else {
    Write-Host "   Erreur lors du push" -ForegroundColor Red
    Write-Host "   Utilisez un token: https://github.com/settings/tokens" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host ""

# 5. Finalisation
Write-Host "[5/5] Termine !" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   DEPLOIEMENT TERMINE AVEC SUCCES" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Site: https://$GitHubUsername.github.io/$RepoName/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Configuration GitHub Pages (a faire une fois):" -ForegroundColor Cyan
Write-Host "   1. https://github.com/$GitHubUsername/$RepoName/settings/pages" -ForegroundColor Gray
Write-Host "   2. Source: 'Deploy from a branch'" -ForegroundColor Gray
Write-Host "   3. Branche: main" -ForegroundColor Gray
Write-Host "   4. Dossier: /docs" -ForegroundColor Gray
Write-Host "   5. Cliquez Save" -ForegroundColor Gray
Write-Host ""
Write-Host "Le site sera disponible dans 2-3 minutes" -ForegroundColor Yellow
Write-Host ""

pause