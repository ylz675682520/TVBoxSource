# 批量修复JAR路径脚本

$rootPath = "c:\Users\Administrator\source\repos\TVBoxSource"
$basePath = "https://gcore.jsdelivr.net/gh/ylz675682520/TVBoxSource@main"

# 定义路径映射关系
$pathMappings = @{
    # 饭太硬相关
    "./饭太硬/spider.jar" = "$basePath/packages/parsers/spider.jar"
    "./饭太硬/drpy.min.js" = "$basePath/configs/sources/line/ziyong/饭太硬/drpy.min.js"
    "./饭太硬/js/drpy.js" = "$basePath/configs/sources/line/ziyong/饭太硬/js/drpy.js"
    "./饭太硬/json/" = "$basePath/configs/sources/line/ziyong/饭太硬/json/"
    "./饭太硬/js/" = "$basePath/configs/sources/line/ziyong/饭太硬/js/"
    
    # 香雅情相关
    "./香雅情/spider.jar" = "$basePath/packages/parsers/spider.jar"
    
    # 运输车相关
    "./运输车/spider.jar" = "$basePath/packages/parsers/spider.jar"
    
    # 菜妮丝相关
    "./菜妮丝/spider.jar" = "$basePath/packages/parsers/spider.jar"
    
    # 肥猫相关
    "./肥猫/spider.jar" = "$basePath/packages/parsers/spider.jar"
    "./肥猫/jars/Alist2.jar" = "$basePath/packages/parsers/spider.jar"
    "./肥猫/jars/csp_search_Yisou.jar" = "$basePath/packages/parsers/spider.jar"
    
    # 巧儿相关
    "./巧儿/spider.jar" = "$basePath/packages/parsers/spider.jar"
    
    # 夜猫子相关
    "./夜猫子/spider.jar" = "$basePath/packages/parsers/spider.jar"
    "./夜猫子/jars/csp_XYQHikerdyx.jar" = "$basePath/packages/parsers/spider.jar"
    "./夜猫子/jars/csp_XBPQ.jar" = "$basePath/packages/parsers/XBPQ.jar"
    "./夜猫子/jars/csp_Nbys.jar" = "$basePath/packages/parsers/spider.jar"
    "./夜猫子/jars/Gitcafe.jar" = "$basePath/packages/parsers/spider.jar"
    "./夜猫子/jars/drpy_js_蜻蜓FM.jar" = "$basePath/packages/parsers/spider.jar"
    "./夜猫子/jars/Alist2.jar" = "$basePath/packages/parsers/spider.jar"
    
    # 多多相关
    "./多多/spider.jar" = "$basePath/packages/parsers/spider.jar"
    "./多多/jars/csp_阿里搜索.jar" = "$basePath/packages/parsers/spider.jar"
    "./多多/jars/csp_XYQHikerdyx.jar" = "$basePath/packages/parsers/spider.jar"
    
    # 南风相关
    "./南风/spider.jar" = "$basePath/packages/parsers/spider.jar"
    "./南风/jars/Gitcafe.jar" = "$basePath/packages/parsers/spider.jar"
    
    # dxawi相关
    "./dxawi/spider.jar" = "$basePath/packages/parsers/spider.jar"
    
    # lib相关 (catcr.json等)
    "./lib/fty.jar" = "$basePath/packages/parsers/fty.jar"
    "./lib/xyq.jar" = "$basePath/packages/parsers/spider.jar"
    "./lib/dj0.jar" = "$basePath/packages/parsers/spider.jar"
    "./lib/guodaxia.jar" = "$basePath/packages/parsers/spider.jar"
    "./lib/alisz.jar" = "$basePath/packages/parsers/spider.jar"
    "./lib/mypg.jar" = "$basePath/packages/parsers/spider.jar"
    
    # packages相关
    "./packages/plugins/huban.jar" = "$basePath/packages/parsers/spider.jar"
    "./packages/parsers/yt-aa.jar" = "$basePath/packages/parsers/yt-aa.jar"
    
    # jar相关
    "./jar/fm.jar" = "$basePath/packages/parsers/fm.jar"
}

Write-Host "开始批量修复JAR路径..." -ForegroundColor Cyan

$filesProcessed = 0
$replacementsCount = 0

# 需要处理的文件列表
$filesToProcess = @(
    "configs/sources/line/ziyong/饭太硬.json",
    "configs/sources/line/ziyong/香雅情.json",
    "configs/sources/line/ziyong/运输车.json",
    "configs/sources/line/ziyong/菜妮丝.json",
    "configs/sources/line/ziyong/肥猫.json",
    "configs/sources/line/ziyong/巧儿.json",
    "configs/sources/line/ziyong/巧儿02.json",
    "configs/sources/line/ziyong/夜猫子.json",
    "configs/sources/line/ziyong/多多.json",
    "configs/sources/line/hot/moyu.json",
    "configs/sources/line/hot/aa.json",
    "configs/sources/line/hot/NanFeng.json",
    "configs/sources/line/hot/dxawi.json",
    "configs/sources/line/hot/catcr.json"
)

foreach ($file in $filesToProcess) {
    $filePath = Join-Path $rootPath $file
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        $originalContent = $content
        
        foreach ($mapping in $pathMappings.GetEnumerator()) {
            $oldPath = $mapping.Key
            $newPath = $mapping.Value
            
            if ($content -like "*$oldPath*") {
                $content = $content -replace [regex]::Escape($oldPath), $newPath
                $replacementsCount++
            }
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "✅ 已修复: $file" -ForegroundColor Green
            $filesProcessed++
        } else {
            Write-Host "⏭️ 无需修复: $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ 文件不存在: $file" -ForegroundColor Red
    }
}

Write-Host "`n=== 修复完成 ===" -ForegroundColor Cyan
Write-Host "处理文件数: $filesProcessed" -ForegroundColor Yellow
Write-Host "替换次数: $replacementsCount" -ForegroundColor Yellow