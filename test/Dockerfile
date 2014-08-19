FROM tmlbl/node
MAINTAINER tmlbl

ADD .. /home/

RUN apt-get install -y git mongodb
RUN npm install -g bower grunt

RUN chmod 777 /home/test/run.sh
ENTRYPOINT /home/test/run.sh

