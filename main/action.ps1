# 检测当前目录是否为 main 目录
$currentDir = Split-Path -Path $PWD -Leaf
if ($currentDir -ne "main") {
    Write-Host "当前不在 main 目录内，防止误删文件，脚本终止。"
    Exit 1
}

# 先删除已有的发行文件
Remove-Item -Path public -Recurse -Force -ErrorAction SilentlyContinue

# 再执行 hugo 创建出公开发布的文件
hugo

# 回到上一级目录
Set-Location -Path ..

# 强制删除和 main 同级的所有文件和文件夹（main、my-blog.code-workspace、隐藏文件夹和 README.md 除外）
Get-ChildItem -Path . -Depth 0 | Where-Object {
    $_.Name -ne 'main' -and
    $_.Name -ne 'my-blog.code-workspace' -and
    $_.Name -ne '.' -and
    $_.Name -notlike '.*' -and
    $_.Name -ne 'README.md'
} | Remove-Item -Recurse -Force

# 把 main 里的 public 文件夹的内容复制到和 main 同级
Copy-Item -Path main\public\* -Destination . -Recurse -Force

# 回到 main 目录
Set-Location -Path main

Write-Host "执行完成！"
