#!/bin/bash

build_cmd() {
  docker build -t tmlbl/fx .;
}

check_image() {
  EXISTS=$(docker images | grep -w 'tmlbl/fx');
  if [ ! "$EXISTS" ]; then
    build_cmd;
  fi
}

down_cmd() {
  FX=$(docker inspect --format={{.State.Running}} fx);
  if [ "$FX" ]; then
    printf "Taking down FX app...\n";
    docker stop -t=0 fx
    docker rm fx
  else
    if [ ! "$1" ]; then
      printf "FX app container is not running\n";
    fi
  fi
  FXDB=$(docker inspect --format={{.State.Running}} fxdb);
  if [ "$FXDB" ]; then
    printf "Taking down FX database...\n";
    docker stop -t=0 fxdb
    docker rm fxdb
  else
    if [ ! "$1" ]; then
      printf "FX database container is not running\n";
    fi
  fi
}

up_cmd() {
  check_image;
  down_cmd "quiet";
  docker run -d --net="host" --name="fxdb" beshippable/dbbase
  docker run -d --net="host" --name="fx" \
    -v $(pwd):/home/ -e NODE_ENV=dev -w /home tmlbl/fx
}

# test_cmd() {
#   check_image;
#   docker run -v $(pwd):/app --name koa_test \
#     -w /app --entrypoint /bin/sh koa /app/boot_test.sh;
#   docker rm koa_test;
# }

usage() {
  printf "forex\n";
  printf "Available Commands:\n";
  printf "\t./fx up\n";
  printf "\t./fx down\n";
  printf "\t./fx test\n";
  printf "\t./fx build\n";
}

if [ "$1" = 'down' ]; then
  down_cmd;
# elif [ "$1" = 'test' ]; then
#   test_cmd;
elif [ "$1" = 'up' ]; then
  up_cmd;
elif [ "$1" = 'build' ]; then
  build_cmd;
else
  usage;
fi
