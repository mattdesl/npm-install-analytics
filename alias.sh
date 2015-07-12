SCRIPT=index.js
DIR=`dirname "$0"`
node "$DIR/${SCRIPT#./}" "$@" & command npm "$@"