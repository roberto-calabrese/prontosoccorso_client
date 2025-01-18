#!/bin/bash
DIR_GENERATE=".output/public"
DIR_ONLINE=".output/online"

echo "GIT PULL"
git pull

echo "Genero la build in $DIR_GENERATE..."
npm run build && npm run generate

echo "aggiunto .htaccess"
cp .htaccess $DIR_GENERATE/

echo "faccio lo switch del deploy"
rm $DIR_ONLINE
cp -r $DIR_GENERATE $DIR_ONLINE
echo "Deploy completato"