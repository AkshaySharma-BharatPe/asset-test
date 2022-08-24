find ./src/assets/ \( -iname '*.gif' -o -iname '*.jpg' -o -iname '*.svg' -o -iname '*.jpeg' -o -iname '*.png' \) -type f -size +100k -exec ls -lh {} \; | wc -l
