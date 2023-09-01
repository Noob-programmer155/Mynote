FROM node:alpine

ENV HOME=/home/app

COPY . ${HOME}/
WORKDIR ${HOME}
RUN npm i
RUN npm run build
RUN npm install -g serve

EXPOSE 3000

ENTRYPOINT exec serve -s build
