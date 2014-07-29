docker stop -t=0 fx fxdb
docker rm fx fxdb
docker run -d --net="host" --name="fxdb" beshippable/dbbase
docker run -d --net="host" --name="fx" \
  -v $(pwd):/home/ -e NODE_ENV=dev -w /home tmlbl/fx

