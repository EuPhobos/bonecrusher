


warzone2100 2>&1 | while read line
do
	col='\033[36m'
	case "$line" in
	error* ) col='\033[31m';;
	info*  ) col='\033[33m';;
	esac
	if [[ "$line" == bc* ]]
	then
#		outArr=(${line//:/})
		IFS=':' read -ra outArr <<< "$line"
		line="${outArr[1]}"
	fi
	echo -e "$col$line"
done





function col()(set -o pipefail;"$@" 2>&1>&3|sed $'s,.*,\e[33m&\e[m,'>&2)3>&1
