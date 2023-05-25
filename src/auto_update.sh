#!/bin/bash
###
 # @author: shane
 # @Date: 2023-05-26 07:55:03
 # @LastEditTime: 2023-05-26 07:55:27
 # @FilePath: \timepost\src\auto_update.sh
### 

# 添加所有更改
git add .

# 获取最近的更改文件列表
changed_files=$(git diff --name-only)

# 根据更改的文件生成提交消息
commit_message="小更新"
for file in $changed_files; do
    commit_message+="\n- Updated: $file"
done

# 提交更改并推送到远程仓库
git commit -m "$commit_message"
git push release main