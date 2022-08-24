RED='\033[0;31m'
NC='\033[0m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
count=$(find ./src/assets/ \( -iname '*.gif' -o -iname '*.jpg' -o -iname '*.svg' -o -iname '*.jpeg' -o -iname '*.png' \) -type f -size +100k -exec ls -lh {} \; | wc -l)
if [[ "${count}" -gt 0 ]]; then 
    find ./src/assets/ \( -iname '*.gif' -o -iname '*.jpg' -o -iname '*.svg' -o -iname '*.jpeg' -o -iname '*.png' \) -type f -size +100k -exec ls -lh {} \; | awk '{ print "\033[31m" $9 " || Size : " $5 }'
    printf "${YELLOW}INFO: Please resize above assets and then proceed${NC}\n\n"
else
    printf "${GREEN}Congratulations, all images are less than 100Kb.${NC}\n\n";
fi
# Script Ends