FROM tmlbl/node
MAINTAINER tmlbl

ADD . /home/

EXPOSE 8080

RUN chmod 777 /home/boot.sh
ENTRYPOINT /home/boot.sh

CMD forever -w app.js

