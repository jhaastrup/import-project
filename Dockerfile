FROM ubuntu:18.04

RUN apt-get update && apt-get upgrade -y && apt-get install -y build-essential gcc g++ git libpq-dev make \
    python3-pip libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0 libffi-dev shared-mime-info \
    libxml2-dev libxslt-dev libssl-dev uwsgi uwsgi-plugin-python3 python3 python3-dev nano curl


RUN curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs && node -v
RUN apt-get update && apt-get upgrade -y

# Employing the layer caching strategy
WORKDIR /app

ADD package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]
