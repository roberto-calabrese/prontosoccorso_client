#!/bin/bash
DIR_GENERATE=".output/public"
DIR_COMPILED="compiled"

echo "GIT PULL"
git pull

echo "Genero la build in $DIR_GENERATE..."
npm run build && npm run generate

echo "aggiunto .htaccess"
cp .htaccess $DIR_GENERATE/

echo "faccio lo switch del deploy"
if [ -d "$DIR_COMPILED" ]; then
  rm -r "$DIR_COMPILED"
  echo "$DIR_COMPILED è stata rimossa"
fi

cp -r $DIR_GENERATE $DIR_COMPILED
echo "Deploy completato"