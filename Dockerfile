FROM tmlbl/node
MAINTAINER tmlbl

ADD . /home/

EXPOSE 8080

RUN apt-get install -y git
RUN npm install -g supervisor forever bower grunt

RUN chmod 777 /home/boot.sh
ENTRYPOINT /home/boot.sh

