FROM postgres:18

RUN apt-get update \
  && apt-get install -y locales \
  && sed -i '/it_IT.UTF-8/s/^# //g' /etc/locale.gen \
  && locale-gen \
  && apt-get clean
