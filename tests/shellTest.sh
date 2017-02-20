#!/bin/bash

url=”http://localhost:80“
content=”$(curl -sLI “$url” | grep HTTP/1.1 | tail -1 | awk {‘print $2′})”
if [ ! -z $content ] && [ $content -eq 200 ]
then
echo “valid url”
else
echo “invalid url”
fi