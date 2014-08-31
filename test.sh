docker run -d --net=host --name=test_db beshippable/dbbase
grunt test
docker stop -t 0 test_db
docker rm test_db
