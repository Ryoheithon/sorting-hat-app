#!/bin/bash

# モデルファイルを保存するディレクトリを作成
mkdir -p public/models

# Supabaseストレージからモデルファイルをダウンロード
curl -o public/models/sorting-hat.glb "https://kgkkwafsdgdmmtcndvwq.supabase.co/storage/v1/object/public/models/sorting-hat.glb"

# ダウンロードが成功したことを確認
if [ -f "public/models/sorting-hat.glb" ]; then
  echo "Model file downloaded successfully!"
else
  echo "Failed to download model file!"
  exit 1
fi