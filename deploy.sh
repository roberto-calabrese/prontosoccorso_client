#!/bin/bash

# Directory temporanea per la build
TEMP_DIR="dist-temp"
LIVE_DIR="dist"

echo "GIT PULL"
git pull

echo "Genero la build in $TEMP_DIR..."
npm run build && npm run generate --output-dir $TEMP_DIR

echo "aggiunto .htaccess"
cp .htaccess $TEMP_DIR/

echo "faccio lo switch del deploy"
mv $LIVE_DIR ${LIVE_DIR}-backup && mv $TEMP_DIR $LIVE_DIR && rm -rf ${LIVE_DIR}-backup

echo "Deploy completato"